package controller

import (
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/constant"
	"github.com/QuantumNous/new-api/dto"
	"github.com/QuantumNous/new-api/model"
	"github.com/QuantumNous/new-api/relay"
	"github.com/QuantumNous/new-api/relay/channel/ai360"
	"github.com/QuantumNous/new-api/relay/channel/lingyiwanwu"
	"github.com/QuantumNous/new-api/relay/channel/minimax"
	"github.com/QuantumNous/new-api/relay/channel/moonshot"
	relaycommon "github.com/QuantumNous/new-api/relay/common"
	"github.com/QuantumNous/new-api/relay/helper"
	"github.com/QuantumNous/new-api/service"
	"github.com/QuantumNous/new-api/setting/operation_setting"
	"github.com/QuantumNous/new-api/types"
	"github.com/gin-gonic/gin"
	"github.com/samber/lo"
)

// https://platform.openai.com/docs/api-reference/models/list

var openAIModels []dto.OpenAIModels
var openAIModelsMap map[string]dto.OpenAIModels
var channelId2Models map[int][]string

func init() {
	// https://platform.openai.com/docs/models/model-endpoint-compatibility
	for i := 0; i < constant.APITypeDummy; i++ {
		if i == constant.APITypeAIProxyLibrary {
			continue
		}
		adaptor := relay.GetAdaptor(i)
		channelName := adaptor.GetChannelName()
		modelNames := adaptor.GetModelList()
		for _, modelName := range modelNames {
			openAIModels = append(openAIModels, dto.OpenAIModels{
				Id:      modelName,
				Object:  "model",
				Created: 1626777600,
				OwnedBy: channelName,
			})
		}
	}
	for _, modelName := range ai360.ModelList {
		openAIModels = append(openAIModels, dto.OpenAIModels{
			Id:      modelName,
			Object:  "model",
			Created: 1626777600,
			OwnedBy: ai360.ChannelName,
		})
	}
	for _, modelName := range moonshot.ModelList {
		openAIModels = append(openAIModels, dto.OpenAIModels{
			Id:      modelName,
			Object:  "model",
			Created: 1626777600,
			OwnedBy: moonshot.ChannelName,
		})
	}
	for _, modelName := range lingyiwanwu.ModelList {
		openAIModels = append(openAIModels, dto.OpenAIModels{
			Id:      modelName,
			Object:  "model",
			Created: 1626777600,
			OwnedBy: lingyiwanwu.ChannelName,
		})
	}
	for _, modelName := range minimax.ModelList {
		openAIModels = append(openAIModels, dto.OpenAIModels{
			Id:      modelName,
			Object:  "model",
			Created: 1626777600,
			OwnedBy: minimax.ChannelName,
		})
	}
	for modelName, _ := range constant.MidjourneyModel2Action {
		openAIModels = append(openAIModels, dto.OpenAIModels{
			Id:      modelName,
			Object:  "model",
			Created: 1626777600,
			OwnedBy: "midjourney",
		})
	}
	openAIModelsMap = make(map[string]dto.OpenAIModels)
	for _, aiModel := range openAIModels {
		openAIModelsMap[aiModel.Id] = aiModel
	}
	channelId2Models = make(map[int][]string)
	for i := 1; i <= constant.ChannelTypeDummy; i++ {
		apiType, success := common.ChannelType2APIType(i)
		if !success || apiType == constant.APITypeAIProxyLibrary {
			continue
		}
		meta := &relaycommon.RelayInfo{ChannelMeta: &relaycommon.ChannelMeta{
			ChannelType: i,
		}}
		adaptor := relay.GetAdaptor(apiType)
		adaptor.Init(meta)
		channelId2Models[i] = adaptor.GetModelList()
	}
	openAIModels = lo.UniqBy(openAIModels, func(m dto.OpenAIModels) string {
		return m.Id
	})
}

func channelOwnerName(channelType int) string {
	apiType, success := common.ChannelType2APIType(channelType)
	if !success {
		return strings.ToLower(constant.GetChannelTypeName(channelType))
	}
	adaptor := relay.GetAdaptor(apiType)
	if adaptor == nil {
		return strings.ToLower(constant.GetChannelTypeName(channelType))
	}
	adaptor.Init(&relaycommon.RelayInfo{ChannelMeta: &relaycommon.ChannelMeta{
		ChannelType: channelType,
	}})
	if name := strings.TrimSpace(adaptor.GetChannelName()); name != "" {
		return name
	}
	return strings.ToLower(constant.GetChannelTypeName(channelType))
}

func getPreferredModelOwners(modelNames []string, groups []string) map[string]string {
	channelTypes, err := model.GetPreferredModelOwnerChannelTypes(modelNames, groups)
	if err != nil {
		common.SysLog(fmt.Sprintf("GetPreferredModelOwnerChannelTypes error: %v", err))
		return map[string]string{}
	}

	ownerByChannelType := make(map[int]string)
	owners := make(map[string]string, len(channelTypes))
	for modelName, channelType := range channelTypes {
		owner, ok := ownerByChannelType[channelType]
		if !ok {
			owner = channelOwnerName(channelType)
			ownerByChannelType[channelType] = owner
		}
		if owner != "" {
			owners[modelName] = owner
		}
	}
	return owners
}

func buildOpenAIModel(modelName string, ownerByModel map[string]string) dto.OpenAIModels {
	var oaiModel dto.OpenAIModels
	if staticModel, ok := openAIModelsMap[modelName]; ok {
		oaiModel = staticModel
	} else {
		oaiModel = dto.OpenAIModels{
			Id:      modelName,
			Object:  "model",
			Created: 1626777600,
			OwnedBy: "custom",
		}
	}
	if owner, ok := ownerByModel[modelName]; ok && owner != "" {
		oaiModel.OwnedBy = owner
	}
	oaiModel.SupportedEndpointTypes = model.GetModelSupportEndpointTypes(modelName)
	return oaiModel
}

type modelListGroups struct {
	userGroup   string
	tokenGroup  string
	ownerGroups []string
}

func getModelListGroups(c *gin.Context) (modelListGroups, error) {
	tokenGroup := common.GetContextKeyString(c, constant.ContextKeyTokenGroup)
	userGroup := common.GetContextKeyString(c, constant.ContextKeyUserGroup)
	if userGroup == "" && (tokenGroup == "" || tokenGroup == "auto") {
		var err error
		userGroup, err = model.GetUserGroup(c.GetInt("id"), false)
		if err != nil {
			return modelListGroups{}, err
		}
	}

	if tokenGroup == "auto" {
		return modelListGroups{
			userGroup:   userGroup,
			tokenGroup:  tokenGroup,
			ownerGroups: service.GetUserAutoGroup(userGroup),
		}, nil
	}

	group := userGroup
	if tokenGroup != "" {
		group = tokenGroup
	}
	return modelListGroups{
		userGroup:   userGroup,
		tokenGroup:  tokenGroup,
		ownerGroups: []string{group},
	}, nil
}

func ListModels(c *gin.Context, modelType int) {
	acceptUnsetRatioModel := operation_setting.SelfUseModeEnabled
	if !acceptUnsetRatioModel {
		userId := c.GetInt("id")
		if userId > 0 {
			userSettings, _ := model.GetUserSetting(userId, false)
			if userSettings.AcceptUnsetRatioModel {
				acceptUnsetRatioModel = true
			}
		}
	}

	userModelNames := make([]string, 0)
	groups, err := getModelListGroups(c)
	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": "get user group failed",
		})
		return
	}
	ownerGroups := groups.ownerGroups
	modelLimitEnable := common.GetContextKeyBool(c, constant.ContextKeyTokenModelLimitEnabled)
	if modelLimitEnable {
		s, ok := common.GetContextKey(c, constant.ContextKeyTokenModelLimit)
		var tokenModelLimit map[string]bool
		if ok {
			tokenModelLimit = s.(map[string]bool)
		} else {
			tokenModelLimit = map[string]bool{}
		}
		for allowModel, _ := range tokenModelLimit {
			if !acceptUnsetRatioModel {
				if !helper.HasModelBillingConfig(allowModel) {
					continue
				}
			}
			userModelNames = append(userModelNames, allowModel)
		}
	} else {
		var models []string
		if groups.tokenGroup == "auto" {
			for _, autoGroup := range ownerGroups {
				groupModels := model.GetGroupEnabledModels(autoGroup)
				for _, g := range groupModels {
					if !common.StringsContains(models, g) {
						models = append(models, g)
					}
				}
			}
		} else {
			models = model.GetGroupEnabledModels(ownerGroups[0])
		}
		for _, modelName := range models {
			if !acceptUnsetRatioModel {
				if !helper.HasModelBillingConfig(modelName) {
					continue
				}
			}
			userModelNames = append(userModelNames, modelName)
		}
	}

	ownerByModel := map[string]string{}
	if len(ownerGroups) > 0 {
		ownerByModel = getPreferredModelOwners(userModelNames, ownerGroups)
	}
	userOpenAiModels := make([]dto.OpenAIModels, 0, len(userModelNames))
	for _, modelName := range userModelNames {
		userOpenAiModels = append(userOpenAiModels, buildOpenAIModel(modelName, ownerByModel))
	}

	switch modelType {
	case constant.ChannelTypeAnthropic:
		useranthropicModels := make([]dto.AnthropicModel, len(userOpenAiModels))
		for i, model := range userOpenAiModels {
			useranthropicModels[i] = dto.AnthropicModel{
				ID:          model.Id,
				CreatedAt:   time.Unix(int64(model.Created), 0).UTC().Format(time.RFC3339),
				DisplayName: model.Id,
				Type:        "model",
			}
		}
		c.JSON(200, gin.H{
			"data":     useranthropicModels,
			"first_id": useranthropicModels[0].ID,
			"has_more": false,
			"last_id":  useranthropicModels[len(useranthropicModels)-1].ID,
		})
	case constant.ChannelTypeGemini:
		userGeminiModels := make([]dto.GeminiModel, len(userOpenAiModels))
		for i, model := range userOpenAiModels {
			userGeminiModels[i] = dto.GeminiModel{
				Name:        model.Id,
				DisplayName: model.Id,
			}
		}
		c.JSON(200, gin.H{
			"models":        userGeminiModels,
			"nextPageToken": nil,
		})
	default:
		c.JSON(200, gin.H{
			"success": true,
			"data":    userOpenAiModels,
			"object":  "list",
		})
	}
}

func ChannelListModels(c *gin.Context) {
	c.JSON(200, gin.H{
		"success": true,
		"data":    openAIModels,
	})
}

func DashboardListModels(c *gin.Context) {
	c.JSON(200, gin.H{
		"success": true,
		"data":    channelId2Models,
	})
}

func EnabledListModels(c *gin.Context) {
	c.JSON(200, gin.H{
		"success": true,
		"data":    model.GetEnabledModels(),
	})
}

func RetrieveModel(c *gin.Context, modelType int) {
	modelId := c.Param("model")
	if aiModel, ok := openAIModelsMap[modelId]; ok {
		switch modelType {
		case constant.ChannelTypeAnthropic:
			c.JSON(200, dto.AnthropicModel{
				ID:          aiModel.Id,
				CreatedAt:   time.Unix(int64(aiModel.Created), 0).UTC().Format(time.RFC3339),
				DisplayName: aiModel.Id,
				Type:        "model",
			})
		default:
			c.JSON(200, aiModel)
		}
	} else {
		openAIError := types.OpenAIError{
			Message: fmt.Sprintf("The model '%s' does not exist", modelId),
			Type:    "invalid_request_error",
			Param:   "model",
			Code:    "model_not_found",
		}
		c.JSON(200, gin.H{
			"error": openAIError,
		})
	}
}

// MarketplaceListModels returns rich model data for the model marketplace page
func MarketplaceListModels(c *gin.Context) {
	type ModelInfo struct {
		Id          string   `json:"id"`
		ChannelId   int      `json:"channel_id"`
		ChannelName string   `json:"channel_name"`
		Vendor      string   `json:"vendor"`
		Enabled     bool     `json:"enabled"`
		ModelTypes  []string `json:"model_types"`
		Tags        []string `json:"tags"`
		InputPrice  string   `json:"input_price"`
		OutputPrice string   `json:"output_price"`
		CreatedAt   string   `json:"created_at"`
	}

	var result []ModelInfo
	// Preload all abilities with channels
	abilitiesWithCh, _ := model.GetAllEnableAbilityWithChannels()

	// Build pricing lookup for fast access
	pricingMap := make(map[string]model.Pricing)
	for _, p := range model.GetPricing() {
		pricingMap[p.ModelName] = p
	}

	for _, ability := range abilitiesWithCh {
		channel, _ := model.GetChannelById(ability.ChannelId, false)
		channelName := "Unknown"
		if channel != nil {
			channelName = channel.Name
		}

		// Extract vendor from model ID (e.g. "deepseek-ai/DeepSeek-V4-Pro" -> "deepseek-ai")
		vendor := ""
		if idx := strings.Index(ability.Model, "/"); idx > 0 {
			vendor = ability.Model[:idx]
		} else {
			vendor = channelName
		}

		// Get model types from supported endpoint types
		modelTypes := make([]string, 0)
		if p, ok := pricingMap[ability.Model]; ok {
			for _, et := range p.SupportedEndpointTypes {
				switch et {
				case "openai", "openai-response", "openai-response-compact", "anthropic", "gemini":
					if !contains(modelTypes, "对话") {
						modelTypes = append(modelTypes, "对话")
					}
				case "image-generation":
					if !contains(modelTypes, "生图") {
						modelTypes = append(modelTypes, "生图")
					}
				case "embeddings":
					if !contains(modelTypes, "嵌入") {
						modelTypes = append(modelTypes, "嵌入")
					}
				case "jina-rerank":
					if !contains(modelTypes, "重排序") {
						modelTypes = append(modelTypes, "重排序")
					}
				case "openai-video":
					if !contains(modelTypes, "视频") {
						modelTypes = append(modelTypes, "视频")
					}
				}
			}
		}
		if len(modelTypes) == 0 {
			modelTypes = append(modelTypes, "对话")
		}

		// Tags from pricing
		tags := make([]string, 0)
		if p, ok := pricingMap[ability.Model]; ok {
			if p.Tags != "" {
				tags = append(tags, strings.Split(p.Tags, ",")...)
			}
			for i, t := range tags {
				tags[i] = strings.TrimSpace(t)
			}
		}

		// Calculate price from model_ratio
		inputPrice := ""
		outputPrice := ""
		if p, ok := pricingMap[ability.Model]; ok {
			// model_ratio: 1 = $0.002/1k tokens, converted to RMB per 1M tokens
			// input = model_ratio * 0.002 * 1000 / 7.3 (approximately)
			if p.ModelRatio > 0 {
				usdPer1M := p.ModelRatio * 2.0 // 0.002 * 1000
				rmbPer1M := usdPer1M / 7.3
				inputPrice = fmt.Sprintf("￥%.0f", rmbPer1M)
				if p.CompletionRatio > 0 {
					outputRmb := rmbPer1M * p.CompletionRatio
					outputPrice = fmt.Sprintf("￥%.0f", outputRmb)
				} else {
					outputPrice = inputPrice
				}
			}
		}
		if inputPrice == "" {
			inputPrice = "暂无"
			outputPrice = "暂无"
		}

		result = append(result, ModelInfo{
			Id:          ability.Model,
			ChannelId:   ability.ChannelId,
			ChannelName: channelName,
			Vendor:      vendor,
			Enabled:     ability.Enabled,
			ModelTypes:  modelTypes,
			Tags:        tags,
			InputPrice:  inputPrice,
			OutputPrice: outputPrice,
			CreatedAt:   "", // TODO: add when available
		})
	}
	c.JSON(200, gin.H{
		"success": true,
		"data":    result,
	})
}

func contains(slice []string, item string) bool {
	for _, s := range slice {
		if s == item {
			return true
		}
	}
	return false
}

// ── Marketplace Model Management (Admin) ─────────────────────────────────

// AdminMarketplaceModels returns all models with marketplace config
func AdminMarketplaceModels(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	size, _ := strconv.Atoi(c.DefaultQuery("size", "50"))
	search := c.Query("search")

	var models []model.Model
	var total int64
	q := model.DB.Model(&model.Model{})
	if search != "" {
		q = q.Where("model_name LIKE ? OR tags LIKE ?", "%"+search+"%", "%"+search+"%")
	}
	q.Count(&total)
	offset := (page - 1) * size
	q.Order("id DESC").Offset(offset).Limit(size).Find(&models)

	// Enrich with vendor name
	type richModel struct {
		model.Model
		VendorName string `json:"vendor_name"`
	}
	result := make([]richModel, len(models))
	for i, m := range models {
		result[i] = richModel{Model: m}
		if m.VendorID > 0 {
			if vendor, err := model.GetVendorByID(m.VendorID); err == nil && vendor != nil {
				result[i].VendorName = vendor.Name
			}
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    result,
		"total":   total,
	})
}

// AdminUpdateMarketplaceModel updates model_type and tags
func AdminUpdateMarketplaceModel(c *gin.Context) {
	var req struct {
		Id        int    `json:"id"`
		ModelType string `json:"model_type"`
		Tags      string `json:"tags"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "参数无效"})
		return
	}
	if req.Id <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "无效的模型ID"})
		return
	}

	updates := map[string]interface{}{}
	if req.ModelType != "" {
		validTypes := map[string]bool{"对话": true, "生图": true, "嵌入": true, "重排序": true, "语音": true, "视频": true}
		if !validTypes[req.ModelType] {
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "无效的模型类型: " + req.ModelType})
			return
		}
		updates["model_type"] = req.ModelType
	}
	if req.Tags != "" {
		updates["tags"] = req.Tags
	}
	if len(updates) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "没有可更新的字段"})
		return
	}

	if err := model.DB.Model(&model.Model{}).Where("id = ?", req.Id).Updates(updates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "message": "更新成功"})
}
