package controller

import (
	"fmt"

	"github.com/QuantumNous/new-api/dto"
	"github.com/QuantumNous/new-api/middleware"
	"github.com/QuantumNous/new-api/model"
	relaycommon "github.com/QuantumNous/new-api/relay/common"
	"github.com/QuantumNous/new-api/types"

	"github.com/gin-gonic/gin"
)

// ExperienceImage handles image generation requests from the experience center.
// Directly parses the request body as ImageRequest and passes it through
// GenRelayInfo → relayHandler pipeline (which dispatches to ImageHelper).
func ExperienceImage(c *gin.Context) {
	userId := c.GetInt("id")

	// Parse request body as ImageRequest
	var imageReq dto.ImageRequest
	if err := c.ShouldBindJSON(&imageReq); err != nil {
		c.JSON(400, gin.H{
			"error": types.NewError(err, types.ErrorCodeInvalidRequest).ToOpenAIError(),
		})
		return
	}

	// Set up user context for pricing/ratio checks
	userCache, err := model.GetUserCache(userId)
	if err != nil {
		c.JSON(500, gin.H{
			"error": types.NewError(err, types.ErrorCodeQueryDataError).ToOpenAIError(),
		})
		return
	}
	userCache.WriteContext(c)

	// Set relay_mode so GenRelayInfo knows this is an image request
	// (Path2RelayMode only recognizes /v1/ prefix, not /pg/)
	c.Set("relay_mode", 5) // relayconstant.RelayModeImagesGenerations

	// GenRelayInfo with the actual parsed request
	relayInfo, err := relaycommon.GenRelayInfo(c, types.RelayFormatOpenAIImage, &imageReq, nil)
	if err != nil {
		c.JSON(400, gin.H{
			"error": types.NewError(err, types.ErrorCodeGenRelayInfoFailed).ToOpenAIError(),
		})
		return
	}

	tempToken := &model.Token{
		UserId: userId,
		Name:   fmt.Sprintf("exp-image-%s", relayInfo.UsingGroup),
		Group:  relayInfo.UsingGroup,
	}
	_ = middleware.SetupContextForToken(c, tempToken)

	// Use relayHandler directly (same path as main Relay function but with parsed request)
	newAPIError := relayHandler(c, relayInfo)
	if newAPIError != nil {
		c.JSON(newAPIError.StatusCode, gin.H{
			"error": newAPIError.ToOpenAIError(),
		})
		return
	}
}

// ExperienceAudio handles TTS/audio generation requests from the experience center.
func ExperienceAudio(c *gin.Context) {
	userId := c.GetInt("id")

	// Parse request body as GeneralOpenAIRequest (TTS uses the same format)
	var audioReq dto.GeneralOpenAIRequest
	if err := c.ShouldBindJSON(&audioReq); err != nil {
		c.JSON(400, gin.H{
			"error": types.NewError(err, types.ErrorCodeInvalidRequest).ToOpenAIError(),
		})
		return
	}

	userCache, err := model.GetUserCache(userId)
	if err != nil {
		c.JSON(500, gin.H{
			"error": types.NewError(err, types.ErrorCodeQueryDataError).ToOpenAIError(),
		})
		return
	}
	userCache.WriteContext(c)

	// Set relay_mode so GenRelayInfo knows this is an audio request
	c.Set("relay_mode", 24) // relayconstant.RelayModeAudioSpeech

	relayInfo, err := relaycommon.GenRelayInfo(c, types.RelayFormatOpenAIAudio, &audioReq, nil)
	if err != nil {
		c.JSON(400, gin.H{
			"error": types.NewError(err, types.ErrorCodeGenRelayInfoFailed).ToOpenAIError(),
		})
		return
	}

	tempToken := &model.Token{
		UserId: userId,
		Name:   fmt.Sprintf("exp-audio-%s", relayInfo.UsingGroup),
		Group:  relayInfo.UsingGroup,
	}
	_ = middleware.SetupContextForToken(c, tempToken)

	newAPIError := relayHandler(c, relayInfo)
	if newAPIError != nil {
		c.JSON(newAPIError.StatusCode, gin.H{
			"error": newAPIError.ToOpenAIError(),
		})
		return
	}
}
