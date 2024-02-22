import http from "@/app/lib/http-common"

class UploadFilesService {
  upload(file: any, onUploadProgress: any) {
    let formData = new FormData()

    formData.append("file", file)

    return http.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    })
  }
}

export default new UploadFilesService()
