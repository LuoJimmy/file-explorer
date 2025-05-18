import type { Directive } from 'vue'

const lazyLoad: Directive = {
  mounted(el: HTMLImageElement, binding) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.src = binding.value
            observer.unobserve(el)
          }
        })
      },
      {
        rootMargin: '50px'
      }
    )

    observer.observe(el)
  }
}

export default lazyLoad
