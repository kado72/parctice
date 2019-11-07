import { Dropbox } from 'dropbox';

const dbx = new Dropbox({
    // リクエストやレスポンスといった HTTP のパイプラインを構成する要素を操作できる fetch() メソッドで非同期のネットワーク通信可能
    accessToken: 'API(hidden)',
    fetch
})

dbx.filesListFolder({
    // route path
    path: ''
}).then(res => console.log(res))