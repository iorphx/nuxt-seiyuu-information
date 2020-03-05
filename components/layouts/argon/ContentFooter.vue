<template>
  <footer class="footer px-4 mx-2">
    <div class="row align-items-center justify-content-lg-between">
      <div class="mb-lg-0 mb-3 col-lg-6">
        <div class="copyright text-center text-lg-left text-muted">
          © {{year}} <a href="https://iorph.com" class="font-weight-bold ml-1" target="_blank" rel="noopener">iorph</a>
        </div>
      </div>
      <div class="col-lg-6">
        <ul class="nav nav-footer justify-content-center justify-content-lg-end">
          <li class="nav-item">
            <a target="_blank" rel="noopener" href="https://twitter.com/iorph_" class="btn btn-icon-only btn-twitter" data-toggle="tooltip" data-original-title="Twitter">
              <i class="fab fa-twitter"></i>
            </a>
          </li>
          <li class="nav-item">
            <a target="_blank" rel="noopener" href="https://github.com/iorphx" class="btn btn-icon-only btn-github mx-2" data-toggle="tooltip" data-original-title="Github">
              <i class="fab fa-github"></i>
            </a>
          </li>
          <li class="nav-item">
            <a target="_blank" rel="noopener" href="mailto:iorph@iorph.com" class="btn btn-icon-only btn-facebook" data-toggle="tooltip" data-original-title="Email">
              <i class="fas fa-envelope"></i>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </footer>
</template>
<script>
export default {
  data() {
    return {
      year: new Date().getFullYear()
    };
  }
};
</script>
<style></style>