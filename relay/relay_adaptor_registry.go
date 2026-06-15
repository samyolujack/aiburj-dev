package relay

import (
	"github.com/QuantumNous/new-api/constant"
	"github.com/QuantumNous/new-api/relay/channel"
	"github.com/QuantumNous/new-api/relay/channel/openaicompat"
	"github.com/QuantumNous/new-api/relay/channel/siliconflow"
)

func init() {
	// ── SiliconFlow: OpenAI-compatible with custom image & rerank handling ──
	RegisterChannel(constant.APITypeSiliconFlow, func() channel.Adaptor {
		return openaicompat.New(openaicompat.Config{
			ChannelName: siliconflow.ChannelName,
			ModelList:   siliconflow.ModelList,
		}, openaicompat.OverrideHooks{})
	})

	// Future channels can be added here:
	// RegisterChannel(constant.APITypeDeepSeek, ...)
	// RegisterChannel(constant.APITypeMoonshot, ...)
}
