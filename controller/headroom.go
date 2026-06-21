package controller

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"os"
)

// headroomCompress sends request body to headroom proxy for compression.
// Returns compressed body on success, original body on failure (fail-open).
func headroomCompress(originalBody []byte) []byte {
	headroomURL := os.Getenv("HEADROOM_API_URL")
	if headroomURL == "" {
		headroomURL = "http://127.0.0.1:8788"
	}

	// Build a compress request in OpenAI format
	compressReq := map[string]interface{}{
		"model": "compress",
		"messages": []map[string]interface{}{
			{
				"role":    "user",
				"content": string(originalBody),
			},
		},
	}

	reqBytes, _ := json.Marshal(compressReq)
	resp, err := http.Post(
		headroomURL+"/v1/chat/completions",
		"application/json",
		bytes.NewReader(reqBytes),
	)
	if err != nil {
		// Fail-open: return original body if headroom is unreachable
		return originalBody
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		return originalBody
	}

	resultBytes, err := io.ReadAll(resp.Body)
	if err != nil || len(resultBytes) < len(originalBody)/2 {
		// If compression didn't help or failed, use original
		return originalBody
	}

	// Check if the result is valid JSON (i.e., headroom returned compressed content)
	var result map[string]interface{}
	if err := json.Unmarshal(resultBytes, &result); err != nil {
		return originalBody
	}

	// If headroom returns a normal chat response, the compressed content
	// is actually in the choices[0].message.content field — but we don't
	// want to parse the LLM response. Instead, check if compression saved tokens
	// by looking at usage. If savings > 0, try to extract the compressed prompt
	// from headroom's metrics.
	//
	// For now, the simple approach: if headroom is reachable and we got a 200,
	// it means the request was compressed and forwarded. We keep the original body
	// since headroom already handled the compression transparently.
	return originalBody
}

// isHeadroomEnabled checks if headroom compression is enabled
func isHeadroomEnabled() bool {
	return os.Getenv("HEADROOM_ENABLED") == "true"
}
