package speedtest

import (
	"crypto/rand"
	"sync"
)

const (
	// ChunkSize is the size of each chunk written during download streaming.
	ChunkSize = 64 * 1024 // 64KB
)

var (
	randomBuffer []byte
	bufferOnce   sync.Once
)

// GetRandomBuffer returns a shared pre-generated random byte buffer.
// The buffer is created once and reused across all download streams
// to avoid repeated memory allocation and random byte generation.
func GetRandomBuffer() []byte {
	bufferOnce.Do(func() {
		randomBuffer = make([]byte, ChunkSize)
		// Fill with random bytes; if crypto/rand fails, use deterministic fill
		if _, err := rand.Read(randomBuffer); err != nil {
			for i := range randomBuffer {
				randomBuffer[i] = byte(i % 256)
			}
		}
	})
	return randomBuffer
}
