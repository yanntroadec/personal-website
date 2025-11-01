'use client'

import { useEffect, useRef } from 'react'

/**
 * FloatingParticles Component
 * 
 * Creates an animated particle system with connecting lines on a canvas background.
 * Particles move randomly and connect when within a certain distance.
 * Auto-adjusts to window resize.
 */
export default function FloatingParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    let animationFrameId: number
    let particles: Particle[] = []

    /**
     * Adjusts canvas size to match window dimensions
     */
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    /**
     * Particle Class
     * 
     * Represents a single animated particle with position, size, speed, and opacity.
     * Each particle moves independently and bounces off canvas edges.
     */
    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      opacity: number

      constructor() {
        // Random initial position (using non-null assertion since canvas is checked above)
        this.x = Math.random() * canvas!.width
        this.y = Math.random() * canvas!.height
        
        // Random size between 1-4 pixels
        this.size = Math.random() * 3 + 1
        
        // Random speed (can be positive or negative)
        this.speedX = Math.random() * 0.5 - 0.25
        this.speedY = Math.random() * 0.5 - 0.25
        
        // Random opacity between 0.3-0.8
        this.opacity = Math.random() * 0.5 + 0.3
      }

      /**
       * Update particle position and handle boundary collisions
       */
      update() {
        this.x += this.speedX
        this.y += this.speedY

        // Bounce off canvas edges (using non-null assertion)
        if (this.x > canvas!.width || this.x < 0) this.speedX *= -1
        if (this.y > canvas!.height || this.y < 0) this.speedY *= -1
      }

      /**
       * Render the particle as a cyan circle
       */
      draw() {
        if (!ctx) return
        ctx.fillStyle = `rgba(34, 211, 238, ${this.opacity})` // cyan-400
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    /**
     * Initialize particle array based on canvas size
     * Scales particle count to screen area (1 particle per 15000 pixels)
     */
    const initParticles = () => {
      particles = []
      const particleCount = Math.floor((canvas!.width * canvas!.height) / 15000)
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle())
      }
    }
    initParticles()

    /**
     * Animation Loop
     * 
     * Updates and renders all particles, then draws connecting lines
     * between nearby particles for a network effect.
     */
    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas!.width, canvas!.height)
      
      // Update and draw all particles
      particles.forEach(particle => {
        particle.update()
        particle.draw()
      })

      // Draw lines connecting nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          // Calculate distance between particles
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          // Connect particles within 150px with fading opacity based on distance
          if (distance < 150) {
            ctx.strokeStyle = `rgba(34, 211, 238, ${0.1 * (1 - distance / 150)})`
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      // Request next frame
      animationFrameId = requestAnimationFrame(animate)
    }
    animate()

    // Cleanup on component unmount
    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  )
}