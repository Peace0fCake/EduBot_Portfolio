import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function initAnimations() {
  gsap.from('#hero h1', {
    opacity: 0,
    y: 50,
    duration: 1.2,
    ease: 'power3.out',
  })

  gsap.from('#hero p', {
    opacity: 0,
    y: 30,
    duration: 1,
    delay: 0.3,
    ease: 'power3.out',
  })
}
