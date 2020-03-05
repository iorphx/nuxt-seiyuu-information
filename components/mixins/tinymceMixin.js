export default {
  data() {
    return {
      apikey: 'zpel2pnmlybuy3wpzrhjp6r00p2ojcsvclnmhh309pyuyje5',
      toolbar: 'undo redo | formatselect | bold italic strikethrough forecolor backcolor | link media image | alignleft aligncenter alignright alignjustify | numlist bullist outdent indent | removeformat | code',
      plugin: 'advlist autolink lists link image charmap preview hr anchor pagebreak wordcount searchreplace visualblocks visualchars media nonbreaking table directionality template paste textpattern imagetools toc emoticons hr code',
      initOptions: {
        language: 'ko_KR',
        language_url: '/js/ko_KR.js',
        height: 300,
        content_css: '/tinymce.css',
        images_upload_url: '/api/upload',
        images_reuse_filename: true,
        branding: false
      }
    }
  }
}
