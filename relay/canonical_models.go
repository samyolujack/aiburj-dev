package relay

import (
	_ "embed"
	"encoding/json"
	"sync"
)

// CanonicalModel represents metadata about a single model offered by a channel.
type CanonicalModel struct {
	ID           string  `json:"id"`            // "deepseek-ai/DeepSeek-V4-Pro"
	Provider     string  `json:"provider"`      // "deepseek"
	DisplayName  string  `json:"display_name"`  // "DeepSeek V4 Pro"
	Type         string  `json:"type"`          // "chat", "image", "video", "audio", "embedding"
	InputPrice   float64 `json:"input_price"`   // per 1M tokens
	OutputPrice  float64 `json:"output_price"`  // per 1M tokens
	ContextLimit int     `json:"context_limit"` // max context window
	Description  string  `json:"description"`   // human-readable description
}

// ChannelMeta holds metadata about a channel/provider.
type ChannelMeta struct {
	Name        string           `json:"name"`        // "SiliconFlow"
	DisplayName string           `json:"display_name"` // "硅基流动"
	BaseURL     string           `json:"base_url"`     // "https://api.siliconflow.cn"
	Type        string           `json:"type"`         // "openai_compatible", "custom"
	Models      []CanonicalModel `json:"models"`
	Features    []string         `json:"features"`     // ["chat", "image", "tts", "video"]
}

// canonicalModelsJSON is the embedded catalog of known models.
// Channels can also register models programmatically via RegisterCanonicalModels.
//
//go:embed canonical_models.json
var canonicalModelsJSON []byte

var (
	canonicalModels   = make(map[int]ChannelMeta) // channelType -> meta
	canonicalModelsMu sync.RWMutex
)

func init() {
	// Load the embedded catalog
	var catalog []struct {
		ChannelType int          `json:"channel_type"`
		Meta        ChannelMeta  `json:"meta"`
	}
	if err := json.Unmarshal(canonicalModelsJSON, &catalog); err == nil {
		for _, entry := range catalog {
			canonicalModels[entry.ChannelType] = entry.Meta
		}
	}
}

// RegisterCanonicalModels adds or updates model metadata for a channel.
func RegisterCanonicalModels(channelType int, meta ChannelMeta) {
	canonicalModelsMu.Lock()
	defer canonicalModelsMu.Unlock()
	canonicalModels[channelType] = meta
}

// GetCanonicalModels returns model metadata for a channel, or empty if not found.
func GetCanonicalModels(channelType int) (ChannelMeta, bool) {
	canonicalModelsMu.RLock()
	defer canonicalModelsMu.RUnlock()
	meta, ok := canonicalModels[channelType]
	return meta, ok
}

// GetAllCanonicalModels returns all registered model metadata.
func GetAllCanonicalModels() map[int]ChannelMeta {
	canonicalModelsMu.RLock()
	defer canonicalModelsMu.RUnlock()
	result := make(map[int]ChannelMeta, len(canonicalModels))
	for k, v := range canonicalModels {
		result[k] = v
	}
	return result
}

// InventoryCheckFunc is called to verify a channel is properly configured.
// Returns nil if the channel is ready, or an error describing what's missing.
type InventoryCheckFunc func() error

var (
	inventoryChecks   = make(map[int]InventoryCheckFunc)
	inventoryChecksMu sync.RWMutex
)

// RegisterInventoryCheck registers a self-check function for a channel.
func RegisterInventoryCheck(channelType int, check InventoryCheckFunc) {
	inventoryChecksMu.Lock()
	defer inventoryChecksMu.Unlock()
	inventoryChecks[channelType] = check
}

// CheckChannelInventory runs the self-check for a channel type.
// Returns nil if no check is registered (assumed OK).
func CheckChannelInventory(channelType int) error {
	inventoryChecksMu.RLock()
	check, ok := inventoryChecks[channelType]
	inventoryChecksMu.RUnlock()
	if !ok {
		return nil
	}
	return check()
}
