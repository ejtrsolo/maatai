package fileServices

import (
	"api/utils"
	"os"
)

func AddURLsToDownload(urlsRequest utils.DownloadRequest, status *utils.DownloadStatus) {
	destinationFolder := os.Getenv("DOWNLOADS_PATH")
	os.MkdirAll(destinationFolder, os.ModePerm)

	for _, url := range urlsRequest.URLs {
		status.UpdateStatus(url, utils.StatusResponse{Status: "pending", Message: "Descarga pendiente", TotalSize: 0, Progress: 0, DownloadID: url}, true)
		go func(url string) {
			if err := utils.DownloadFile(url, destinationFolder+utils.ExtractFilename(url), status); err != nil {
				status.UpdateStatus(url, utils.StatusResponse{Status: "error", Message: err.Error()}, false)
			} else {
				status.UpdateStatus(url, utils.StatusResponse{
					Status:     "success",
					Message:    "Descarga completa",
					Progress:   100,
					TotalSize:  status.Status[url].TotalSize,
					DownloadID: url,
				}, false)
			}
		}(url)
	}
}
