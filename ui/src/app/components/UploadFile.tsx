import React, {useState} from "react"
import uploadFileService from "@/app/lib/upload-file-service"

const initialState = {
  selectedFiles: undefined,
  currentFile: undefined,
  progress: 0,
  message: undefined,
}

interface UploadFileProps {
  table: string,
  onFileUploaded?: () => void
}

export default function UploadFile(props: UploadFileProps) {
  const [state, setState] = useState<any>(initialState)

  function selectFile(event: any) {
    setState({
      progress: 0,
      message: undefined,
      currentFile: event.target.files[0],
      selectedFiles: event.target.files,
    })
  }

  function upload() {
    const currentFile = state.selectedFiles[0]

    setState({
      currentFile: currentFile,
    })

    uploadFileService.upload(currentFile, props.table, (event: any) => {
      setState({
        currentFile,
        progress: Math.round((100 * event.loaded) / event.total),
      })
    }).then((r: { data: any }) => {
      setState({
        message: r.data,
        currentFile: undefined,
      })

      if (props.onFileUploaded !== undefined) {
        props.onFileUploaded()
      }
    }).catch(() => {
      setState({
        message: "Could not upload the file!",
        currentFile: undefined,
      })
    })
  }

  const {
    selectedFiles,
    currentFile,
    progress,
    message,
  } = state

  return (
          <div>
            <div className="row row-cols-auto">
              <div className="col px-1">
                <input className="form-control form-control-sm" type="file" id="formFile" onChange={selectFile}/>
              </div>
              <div className="col px-1">
                <button className="btn btn-sm btn-success" disabled={!selectedFiles} onClick={upload}>Upload</button>
              </div>
              {message && (
                      <div className="col">
                        <div className="alert alert-sm alert-light alert-dismissible" role="alert">
                          {message}
                          <button type="button" className="btn-close" data-bs-dismiss="alert"
                                  aria-label="Close"></button>
                        </div>
                      </div>
              )}
            </div>
            {currentFile && (
                    <div className="progress">
                      <div className="progress-bar progress-bar-info progress-bar-striped"
                           role="progressbar"
                           aria-valuenow={progress}
                           aria-valuemin={0}
                           aria-valuemax={100}
                           style={{width: progress + "%"}}>
                        {progress}%
                      </div>
                    </div>
            )}
          </div>
  )
}
