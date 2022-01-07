module.exports ={
  lintOnSave: false,
  publicPath:  process.env.NODE_ENV === 'production'
    ? '/owavg-tool/' // production base url.
    : '/',
}
