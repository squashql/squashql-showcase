import http from "@/app/lib/http-common"

class UploadFilesService {
  upload(file: any, table: string, onUploadProgress: any) {
    const formData = new FormData()
    formData.append("file", file)
    return http.post("/upload", formData, {
      params: {
        table
      },
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    })
  }
}

const uploadFilesService = new UploadFilesService()
export default uploadFilesService
