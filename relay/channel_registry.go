package relay

import (
	"sync"

	"github.com/QuantumNous/new-api/relay/channel"
)

// channelRegistry is a concurrent-safe map that maps channel type IDs (int)
// to adaptor constructor functions.
//
// It coexists with the legacy GetAdaptor() switch statement: the switch
// handles channels that have type-specific logic, while the registry
// covers generic OpenAI-compatible channels that don't need code changes.
//
// Over time, channels in the switch can be migrated to the registry
// by replacing their case with a registry lookup.
var (
	channelRegistry   = make(map[int]func() channel.Adaptor)
	channelRegistryMu sync.RWMutex
)

// RegisterChannel registers an adaptor constructor for the given channel type.
// It is safe to call from init() functions or during setup.
func RegisterChannel(channelType int, constructor func() channel.Adaptor) {
	channelRegistryMu.Lock()
	defer channelRegistryMu.Unlock()
	channelRegistry[channelType] = constructor
}

// GetAdaptorFromRegistry returns an adaptor from the registry if one exists,
// or nil if the channel type is not registered.
func GetAdaptorFromRegistry(channelType int) channel.Adaptor {
	channelRegistryMu.RLock()
	defer channelRegistryMu.RUnlock()
	if ctor, ok := channelRegistry[channelType]; ok {
		return ctor()
	}
	return nil
}

// GetAdaptorEnhanced first checks the registry, then falls back to the
// legacy switch. This allows gradual migration without breaking anything.
func GetAdaptorEnhanced(apiType int) channel.Adaptor {
	if a := GetAdaptorFromRegistry(apiType); a != nil {
		return a
	}
	return GetAdaptor(apiType)
}
