package filesHandlers

import (
	fileServices "api/internal/services"
	"api/utils"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gofiber/fiber/v2"
)

func HandleDownload(ctx *fiber.Ctx, status *utils.DownloadStatus) error {
	// Verificar si hay descargas en proceso
	if status.IsAnyDownloading() {
		return ctx.Status(http.StatusConflict).JSON(utils.GeneralResponse{
			Status:  "error",
			Message: "No se pueden ejecutar descargas porque aún hay descargas en proceso",
		})
	}

	var downloadRequest utils.DownloadRequest
	if err := ctx.BodyParser(&downloadRequest); err != nil {
		fmt.Println("Error parsing request body:", err)

		bodyBytes := ctx.Request().Body()
		bodyString := string(bodyBytes)
		fmt.Println("Body:", bodyString)

		return ctx.Status(http.StatusBadRequest).JSON(utils.GeneralResponse{
			Status:  "error",
			Message: fmt.Sprintf("Error: la petición es inválida, verifique la información enviada: %s", err),
		})
	}

	fileServices.AddURLsToDownload(downloadRequest, status)

	var responses []utils.StatusResponse
	for _, url := range downloadRequest.URLs {
		responses = append(responses, utils.StatusResponse{Status: "started", Message: "Descarga iniciada", Progress: 0, TotalSize: 0, DownloadID: url})
	}

	_, err := json.Marshal(responses)
	if err != nil {
		return ctx.Status(http.StatusInternalServerError).JSON(utils.GeneralResponse{
			Status:  "error",
			Message: fmt.Sprintf("Error al generar respuesta de servicio: %s", err),
		})
	}

	// Devolver la respuesta JSON con Fiber
	return ctx.Status(http.StatusOK).JSON(utils.GeneralResponse{
		Status:  "success",
		Message: "OK",
		Data:    responses,
	})
}

func HandleAddURLs(ctx *fiber.Ctx, status *utils.DownloadStatus) error {
	var addURLsRequest utils.DownloadRequest
	if err := ctx.BodyParser(&addURLsRequest); err != nil {
		fmt.Println("Error parsing request body:", err)

		bodyBytes := ctx.Request().Body()
		bodyString := string(bodyBytes)
		fmt.Println("Body:", bodyString)

		return ctx.Status(http.StatusBadRequest).JSON(utils.GeneralResponse{
			Status:  "error",
			Message: fmt.Sprintf("Error: la petición es inválida, verifique la información enviada: %s", err),
		})
	}

	fileServices.AddURLsToDownload(addURLsRequest, status)

	return returnResponses(ctx, status)
}

func HandleStatus(ctx *fiber.Ctx, status *utils.DownloadStatus) error {
	status.Mu.Lock()
	defer status.Mu.Unlock()

	return returnResponses(ctx, status)
}
func HandleQueueClean(ctx *fiber.Ctx, status *utils.DownloadStatus) error {
	status.Mu.Lock()
	defer status.Mu.Unlock()

	status.Status = make(map[string]utils.StatusResponse)

	return returnResponses(ctx, status)
}

func returnResponses(ctx *fiber.Ctx, status *utils.DownloadStatus) error {
	var responses []utils.StatusResponse
	for _, response := range status.Status {
		responses = append(responses, response)
	}

	// Devolver la respuesta JSON con Fiber
	return ctx.Status(http.StatusOK).JSON(utils.GeneralResponse{
		Status:  "success",
		Message: "OK",
		Data:    responses,
	})
}
