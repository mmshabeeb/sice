const fs = require('fs');
const path = require('path');

const prototypeHtmlPath = path.join(__dirname, 'prototype.html');
const globalsCssPath = path.join(__dirname, 'web', 'src', 'app', 'globals.css');
const pageTsxPath = path.join(__dirname, 'web', 'src', 'app', 'page.tsx');

let htmlContent = fs.readFileSync(prototypeHtmlPath, 'utf8');

// 1. Extract CSS
const styleMatch = htmlContent.match(/<style>([\s\S]*?)<\/style>/);
if (styleMatch) {
    let cssContent = `@import "tailwindcss";\n` + styleMatch[1];
    
    // Fix background image url
    cssContent = cssContent.replace(/url\('hero-bg\.png'\)/g, "url('/hero-bg.png')");
    
    fs.writeFileSync(globalsCssPath, cssContent);
    console.log('CSS extracted and written to globals.css');
}

// 2. Extract Body
const bodyMatch = htmlContent.match(/<body>([\s\S]*?)<\/body>/);
if (bodyMatch) {
    let bodyContent = bodyMatch[1];

    // Remove the trailing script tag as we'll handle it in useEffect
    bodyContent = bodyContent.replace(/<script>[\s\S]*?<\/script>/g, '');

    // Convert attributes for React
    bodyContent = bodyContent.replace(/class="/g, 'className="');
    bodyContent = bodyContent.replace(/for="/g, 'htmlFor="');
    
    // Convert HTML comments to JSX comments
    bodyContent = bodyContent.replace(/<!--([\s\S]*?)-->/g, '{/*$1*/}');

    // Self-close tags for React
    bodyContent = bodyContent.replace(/<br>/g, '<br/>');
    bodyContent = bodyContent.replace(/<input([^>]*[^/])>/g, '<input$1 />');

    // Fix event handlers and SVG properties for React
    bodyContent = bodyContent.replace(/onsubmit="event.preventDefault\(\); alert\('Form connected to backend on launch.'\);"/g, "onSubmit={(e) => { e.preventDefault(); alert('Form connected to backend on launch.'); }}");
    bodyContent = bodyContent.replace(/stroke-dasharray/g, 'strokeDasharray');
    bodyContent = bodyContent.replace(/stroke-width/g, 'strokeWidth');

    // Fix specific inline styles to React style objects
    bodyContent = bodyContent.replace(/style="top: 15%; left: 12%; animation-delay: 0s;"/g, 'style={{top: "15%", left: "12%", animationDelay: "0s"}}');
    bodyContent = bodyContent.replace(/style="top: 25%; left: 78%; animation-delay: 1.2s;"/g, 'style={{top: "25%", left: "78%", animationDelay: "1.2s"}}');
    bodyContent = bodyContent.replace(/style="top: 60%; left: 18%; animation-delay: 2.4s;"/g, 'style={{top: "60%", left: "18%", animationDelay: "2.4s"}}');
    bodyContent = bodyContent.replace(/style="top: 70%; left: 84%; animation-delay: 3.6s;"/g, 'style={{top: "70%", left: "84%", animationDelay: "3.6s"}}');
    bodyContent = bodyContent.replace(/style="top: 35%; left: 50%; animation-delay: 1.8s;"/g, 'style={{top: "35%", left: "50%", animationDelay: "1.8s"}}');
    bodyContent = bodyContent.replace(/style="top: 80%; left: 42%; animation-delay: 4.2s;"/g, 'style={{top: "80%", left: "42%", animationDelay: "4.2s"}}');
    bodyContent = bodyContent.replace(/style="top: 20%; left: 32%; animation-delay: 5s;"/g, 'style={{top: "20%", left: "32%", animationDelay: "5s"}}');
    bodyContent = bodyContent.replace(/style="top: 50%; left: 70%; animation-delay: 2.8s;"/g, 'style={{top: "50%", left: "70%", animationDelay: "2.8s"}}');
    bodyContent = bodyContent.replace(/style="top: 45%; left: 8%; animation-delay: 6s;"/g, 'style={{top: "45%", left: "8%", animationDelay: "6s"}}');
    bodyContent = bodyContent.replace(/style="top: 12%; left: 62%; animation-delay: 0.6s;"/g, 'style={{top: "12%", left: "62%", animationDelay: "0.6s"}}');

    bodyContent = bodyContent.replace(/style="font-size: 15px; line-height: 1.7; color: rgba\(8,13,38,0.78\); max-width: 560px;"/g, 'style={{fontSize: "15px", lineHeight: "1.7", color: "rgba(8,13,38,0.78)", maxWidth: "560px"}}');
    bodyContent = bodyContent.replace(/style="border-left-color: var\(--gold-deep\); background: var\(--indigo\); color: var\(--cream\);"/g, 'style={{borderLeftColor: "var(--gold-deep)", background: "var(--indigo)", color: "var(--cream)"}}');
    bodyContent = bodyContent.replace(/style="color: var\(--gold\);"/g, 'style={{color: "var(--gold)"}}');
    bodyContent = bodyContent.replace(/style="color: var\(--cream\);"/g, 'style={{color: "var(--cream)"}}');
    bodyContent = bodyContent.replace(/style="color: rgba\(240,235,224,0.7\);"/g, 'style={{color: "rgba(240,235,224,0.7)"}}');
    bodyContent = bodyContent.replace(/style="color: rgba\(240,235,224,0.5\); border-top-color: var\(--indigo-line\);"/g, 'style={{color: "rgba(240,235,224,0.5)", borderTopColor: "var(--indigo-line)"}}');
    bodyContent = bodyContent.replace(/style="background: var\(--indigo\); color: var\(--cream\);"/g, 'style={{background: "var(--indigo)", color: "var(--cream)"}}');
    bodyContent = bodyContent.replace(/style="font-size: 16px; line-height: 1.7; color: rgba\(240,235,224,0.82\); margin-bottom: 24px;"/g, 'style={{fontSize: "16px", lineHeight: "1.7", color: "rgba(240,235,224,0.82)", marginBottom: "24px"}}');
    bodyContent = bodyContent.replace(/style="font-size: 15px; line-height: 1.7; color: rgba\(240,235,224,0.72\); margin-bottom: 24px;"/g, 'style={{fontSize: "15px", lineHeight: "1.7", color: "rgba(240,235,224,0.72)", marginBottom: "24px"}}');
    bodyContent = bodyContent.replace(/style="background: var\(--gold\);"/g, 'style={{background: "var(--gold)"}}');
    bodyContent = bodyContent.replace(/style="margin-top: 32px;"/g, 'style={{marginTop: "32px"}}');

    const pageTsxContent = `"use client";

import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    // Nav background tightens on scroll
    const nav = document.getElementById('nav');
    if (nav) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 50) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
      });
    }

    // Mobile menu toggle
    const toggle = document.querySelector('.nav-toggle');
    if (toggle) {
      toggle.addEventListener('click', () => {
        const links = document.querySelector('.nav-links') as HTMLElement;
        if (links) {
          const isOpen = links.style.display === 'flex';
          links.style.display = isOpen ? 'none' : 'flex';
          if (!isOpen) {
            links.style.flexDirection = 'column';
            links.style.position = 'absolute';
            links.style.top = '100%';
            links.style.left = '0';
            links.style.right = '0';
            links.style.background = 'rgba(8, 13, 38, 0.98)';
            links.style.padding = '24px 32px';
            links.style.gap = '20px';
          }
        }
      });
    }

    document.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth < 900) {
          const links = document.querySelector('.nav-links') as HTMLElement;
          if (links) links.style.display = 'none';
        }
      });
    });

    // Scroll-reveal animations using IntersectionObserver
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -80px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }, []);

  return (
    <>
${bodyContent}
    </>
  );
}
`;
    fs.writeFileSync(pageTsxPath, pageTsxContent);
    console.log('page.tsx written successfully');
}
