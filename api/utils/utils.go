package utils

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
	"sync"
)

type DownloadRequest struct {
	URLs []string `json:"urls"`
}

type StatusResponse struct {
	Status     string `json:"status"`
	Message    string `json:"message,omitempty"`
	Progress   int    `json:"progress,omitempty"`
	TotalSize  int64  `json:"totalSize,omitempty"`
	DownloadID string `json:"downloadId,omitempty"`
}
type GeneralResponse struct {
	Status  string           `json:"status"`
	Message string           `json:"message"`
	Data    []StatusResponse `json:"data,omitempty"`
}

type DownloadStatus struct {
	Mu     sync.Mutex
	Status map[string]StatusResponse
}

func (ds *DownloadStatus) UpdateStatus(url string, status StatusResponse) {
	ds.Mu.Lock()
	defer ds.Mu.Unlock()
	if _, exists := ds.Status[url]; exists {
		ds.Status[url] = status
	}
}

func (ds *DownloadStatus) IsAnyDownloading() bool {
	ds.Mu.Lock()
	defer ds.Mu.Unlock()

	for _, response := range ds.Status {
		if response.Status == "downloading" || response.Status == "started" || response.Status == "pending" {
			return true
		}
	}

	return false
}

func GetFileSize(url string) (int64, error) {
	response, err := http.Head(url)
	if err != nil {
		return 0, err
	}
	defer response.Body.Close()

	size := response.ContentLength
	if size == -1 {
		return 0, fmt.Errorf("No se pudo determinar el tamaño del archivo desde la URL")
	}

	return size, nil
}

func DownloadFile(url, destination string, status *DownloadStatus) error {
	fmt.Println("Destino del archivo: ", destination)
	size, err := GetFileSize(url)
	if err != nil {
		return fmt.Errorf("Error al obtener tamaño del archivo %s: %s", url, err)
	}
	fmt.Println("Tamaño del archivo: ", url, size)
	response, err := http.Get(url)
	if err != nil {
		return fmt.Errorf("Error downloading %s: %s", url, err)
	}
	fmt.Println("Descargando: ", url)
	defer response.Body.Close()

	file, err := os.Create(destination)
	if err != nil {
		return fmt.Errorf("Error al crear archivo %s: %s", destination, err)
	}
	defer file.Close()

	// Obtener el tamaño total del archivo para calcular el porcentaje
	totalSize := size

	buffer := make([]byte, 1024)
	var currentSize int64

	fmt.Println("Leyendo archivo:", url)
	for {
		n, err := response.Body.Read(buffer)
		if err != nil {
			if err != io.EOF {
				return fmt.Errorf("Error al leer archivo desde %s: %s", url, err)
			}
			break
		}

		currentSize += int64(n)
		progress := int(float64(currentSize) / float64(totalSize) * 100)
		if progress > 100 {
			progress = 99
		}

		if _, exists := status.Status[url]; !exists {
			fmt.Println("Se canceló descarga: ", url, err)
			break
		}

		status.UpdateStatus(url, StatusResponse{Status: "downloading", Message: "Descarga en proceso", Progress: progress, TotalSize: totalSize, DownloadID: url})

		file.Write(buffer[:n])
	}

	return nil
}

func ExtractFilename(url string) string {
	return url[strings.LastIndex(url, "/")+1:]
}
