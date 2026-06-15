package openaicompat

import (
	"errors"
	"fmt"
	"io"
	"net/http"

	"github.com/QuantumNous/new-api/dto"
	"github.com/QuantumNous/new-api/relay/channel"
	"github.com/QuantumNous/new-api/relay/channel/openai"
	relaycommon "github.com/QuantumNous/new-api/relay/common"
	"github.com/QuantumNous/new-api/relay/constant"
	"github.com/QuantumNous/new-api/types"

	"github.com/gin-gonic/gin"
)

// Config holds the minimal configuration for an OpenAI-compatible channel.
// Any OpenAI-compatible provider only needs to fill this struct.
type Config struct {
	ChannelName string   // e.g. "SiliconFlow", "DeepSeek"
	BaseURL     string   // e.g. "https://api.siliconflow.cn" (without trailing v1)
	ModelList   []string // supported models
}

// OverrideHooks allows a channel to override specific methods that differ
// from the standard OpenAI behaviour (e.g. SiliconFlow image format).
type OverrideHooks struct {
	// Request conversion hooks
	ConvertOpenAIRequest  func(*gin.Context, *relaycommon.RelayInfo, *dto.GeneralOpenAIRequest) (any, error)
	ConvertImageRequest   func(*gin.Context, *relaycommon.RelayInfo, dto.ImageRequest) (any, error)
	ConvertRerankRequest  func(*gin.Context, int, dto.RerankRequest) (any, error)
	ConvertEmbeddingRequest func(*gin.Context, *relaycommon.RelayInfo, dto.EmbeddingRequest) (any, error)

	// Response handling
	DoResponse func(*gin.Context, *http.Response, *relaycommon.RelayInfo) (usage any, err *types.NewAPIError)

	// URL building — return empty string to use default
	GetRequestURL func(*relaycommon.RelayInfo) (string, error)
}

// Adaptor is a generic OpenAI-compatible channel adaptor.
// It delegates all standard behaviour to openai.Adaptor and only
// applies channel-specific overrides where configured.
type Adaptor struct {
	config  Config
	hooks   OverrideHooks
	openai  openai.Adaptor
}

// New creates a new OpenAI-compatible adaptor with the given config.
// OverrideHooks can be empty — all methods will default to openai.Adaptor.
func New(cfg Config, hooks OverrideHooks) *Adaptor {
	return &Adaptor{
		config: cfg,
		hooks:  hooks,
		openai: openai.Adaptor{},
	}
}

// ── Adaptor interface ──────────────────────────────────────────────

func (a *Adaptor) Init(info *relaycommon.RelayInfo) {}

func (a *Adaptor) GetRequestURL(info *relaycommon.RelayInfo) (string, error) {
	if a.hooks.GetRequestURL != nil {
		return a.hooks.GetRequestURL(info)
	}
	if info.RelayMode == constant.RelayModeRerank {
		return fmt.Sprintf("%s/v1/rerank", info.ChannelBaseUrl), nil
	}
	return relaycommon.GetFullRequestURL(info.ChannelBaseUrl, info.RequestURLPath, info.ChannelType), nil
}

func (a *Adaptor) SetupRequestHeader(c *gin.Context, req *http.Header, info *relaycommon.RelayInfo) error {
	channel.SetupApiRequestHeader(info, c, req)
	req.Set("Authorization", fmt.Sprintf("Bearer %s", info.ApiKey))
	return nil
}

func (a *Adaptor) ConvertOpenAIRequest(c *gin.Context, info *relaycommon.RelayInfo, request *dto.GeneralOpenAIRequest) (any, error) {
	if a.hooks.ConvertOpenAIRequest != nil {
		return a.hooks.ConvertOpenAIRequest(c, info, request)
	}
	return request, nil
}

func (a *Adaptor) ConvertRerankRequest(c *gin.Context, relayMode int, request dto.RerankRequest) (any, error) {
	if a.hooks.ConvertRerankRequest != nil {
		return a.hooks.ConvertRerankRequest(c, relayMode, request)
	}
	return request, nil
}

func (a *Adaptor) ConvertEmbeddingRequest(c *gin.Context, info *relaycommon.RelayInfo, request dto.EmbeddingRequest) (any, error) {
	if a.hooks.ConvertEmbeddingRequest != nil {
		return a.hooks.ConvertEmbeddingRequest(c, info, request)
	}
	return request, nil
}

func (a *Adaptor) ConvertAudioRequest(c *gin.Context, info *relaycommon.RelayInfo, request dto.AudioRequest) (io.Reader, error) {
	return a.openai.ConvertAudioRequest(c, info, request)
}

func (a *Adaptor) ConvertImageRequest(c *gin.Context, info *relaycommon.RelayInfo, request dto.ImageRequest) (any, error) {
	if a.hooks.ConvertImageRequest != nil {
		return a.hooks.ConvertImageRequest(c, info, request)
	}
	return a.openai.ConvertImageRequest(c, info, request)
}

func (a *Adaptor) ConvertClaudeRequest(c *gin.Context, info *relaycommon.RelayInfo, req *dto.ClaudeRequest) (any, error) {
	return a.openai.ConvertClaudeRequest(c, info, req)
}

func (a *Adaptor) ConvertGeminiRequest(c *gin.Context, info *relaycommon.RelayInfo, req *dto.GeminiChatRequest) (any, error) {
	return a.openai.ConvertGeminiRequest(c, info, req)
}

func (a *Adaptor) ConvertOpenAIResponsesRequest(c *gin.Context, info *relaycommon.RelayInfo, request dto.OpenAIResponsesRequest) (any, error) {
	return nil, errors.New("not implemented")
}

func (a *Adaptor) DoRequest(c *gin.Context, info *relaycommon.RelayInfo, requestBody io.Reader) (any, error) {
	return a.openai.DoRequest(c, info, requestBody)
}

func (a *Adaptor) DoResponse(c *gin.Context, resp *http.Response, info *relaycommon.RelayInfo) (usage any, err *types.NewAPIError) {
	if a.hooks.DoResponse != nil {
		return a.hooks.DoResponse(c, resp, info)
	}
	return a.openai.DoResponse(c, resp, info)
}

func (a *Adaptor) GetModelList() []string {
	return a.config.ModelList
}

func (a *Adaptor) GetChannelName() string {
	return a.config.ChannelName
}
