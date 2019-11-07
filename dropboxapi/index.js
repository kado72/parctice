import { Dropbox } from 'dropbox';

const dbx = new Dropbox({
    accessToken: 'API(hidden)',
    fetch
})

const fileListElem = document.querySelector('.js-file-list')
const loadingElem = document.querySelector('.js-loading')
// change the directory
const rootPathForm = document.querySelector('.js-root-path__form')
const rootPathInput = document.querySelector('.js-root-path__input')
// moveing files
const organizeBtn = document.querySelector('.js-organize-btn')

rootPathForm.addEventListener('submit', e=> {
  e.preventDefault();
  state.rootePath === rootPathInput.value === '/' ? '' : rootePathInput.value.toLowerCase  
  reset()
})

organizeBtn.addEvenetListener('click', async e =>{
    const orginalMsg = e.target.innerHTML
    e.target.disabled = true
    e.target.innerHTML = 'Working...'
    await moveFilesToDatedFolders()
    e.target.disabled = false
    e.target.innderHTML = orginalMsg
    reset()
})

// init path
const reset = () => {
    state.files = []
    loadingElem.classList.remove('hidden')
    init()
}

const state = {
    files: []
}

const init = async () => {
    const res = await dbx.filesListFolder({
        path: state.rootPath,
        limit: 20
    })
        updateFiles(res.entries)
        if (res.ha_more){
            loadingElem.callList.remove('hidden')
            // add callback with await because res is await
            await getMoreFiles(res.cursor, more => updateFiles(more.entries) )
            loadingElem.classList.add('hidden')
        } else{
            loadingElem.classList.add('hidden')
        }
}

const updateFiles = files =>  {
    state.files = [...state.files, ...files]
    updateFiles(res.entries)
    getThumnails(files)
}

const getMoreFiles = async (cursor, cb) => {
    const res = await dbx.filesListFolderContinue( {cursor })
    if (cb) cb(res)
    if (res.has_more){
        await getMoreFiles(res.cursor, cb)
    }
}

const renderFiles = () => {
    fileListElem.innerHTML = state.files.sort((a,b) =>{
        // sort alphabet
        if((a['.tag'] === 'folder' || b['.tag'] === 'folder')
          && !(a['.tag'] === b['.tag'])) {
          return a['.tag'] === 'folder' ? -1 : 1
    } else {
        return a.name.toLowerCase() < b.name.toLowerCase() ? -1: 1
    }
}).map((file =>{
    const type = file['.tag']
    // check
    let thumbnail
    if(type === 'file'){
    }else{
        thumbnail = file.thumbnail
        ? `data:image/jpeg:base64,${file.thumbnail}` 
        : `data:image/svg+xml;base64, 
        `        // default
    }

    return `
    <li class = 'dbx-list-item ${type}'>
      <img class='dbx-thumb' src='${thumbnail}'>
      ${file.name}
    </li>
    `
    // show all files
}).join('')

)
}
getThumbnails = async files =>{
    const paths = files.fileter(file => file['.tag'] === 'file')
    .map(
        file =>({
        path: file.path_lower,
        size: 'w32h32'
    }))
    const res = await dbx.filesGetThumbnailBatch({
        entries: pahts
})
    console.log(res) // promise
    // {entries: [{.tag: "success", metadata: {name: "AZ-car-rental.jpg", path_lower: "/az-car-rental.jpg", path_display: "/AZ-car-rental.jpg", id: "id:52qdMpnOW6AAAAAAAAAAhQ", client_modified: "2018-12-26T18:26:29Z", server_modified: "2019-01-19T23:26:01Z", rev: "01a84000000010e0ce6a0", size: 74987, media_info: {.tag: "metadata", metadata: {.tag: "photo", dimensions: {height: 853, width: 547}, time_taken: "2011-01-17T08:46:09Z"}}, content_hash: "f61140d99b281e33d84a966a928e27c31c8fda0567ef1a122f63b31570d58a84"}, thumbnail:が出力される
    // make a copy of state.files
    const newStateFiles = [...state.files]
    // llop throught the gile object returned from sbx
    resolveSoa.entries.forEach(file=>{
        let indexToUpdate = state.fles.findIndex(
            stateFile => file.metadata.path_lower === stateFile.path_lower
        )
        // put a .thumbnail property on the corresponing file
        newStateFiles[indxToUpdate].thumbnail = file.thumbnail
    })
    state.files = newStateFiles
    renderFiles()
}

const moveFiesToDatedFolders = async () => {
    const entries = state.files
    .filter(files => file['.tag'] === 'file')
    .map(file => {
        file.client_modified
        const date = new Date(file.client_modified);
        return{
            from_path: file.path_lower,
            to_path: `${state.rootPath}/${date.getUTCFullYear()}/${date.getUTCMonth} + 1}/${file.name}`
        }
    })
    // moving file
    dbx.filesMoveBatchV2({ entries })

    try {
        let res = await dbx.filesMoveBatchV2({ entries })
    
    const { async_job_id } = res
    if (sync_job_id){
    do{
        res = await dbx.filesMoveBatchCheckV2({ entries })
        console.log(res)
    } while(res['.tag'] === 'in_progress')   
    }
} catch(err){
    console.error(err)
  }
}
init()