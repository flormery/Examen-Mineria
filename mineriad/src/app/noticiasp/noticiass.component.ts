import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { supabase } from '../supabaseClient';

interface Noticia {
  id: number;
  diario: string;
  titulo: string;
  fecha: string;
  enlace: string;
  contenido: string;
  autor: string;
  categoria: string;
  imagen_url: string;
  descripcion: string;
  lugar: string;
}

@Component({
  selector: 'app-noticiass',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen">
      <!-- Header glassmorphism sticky mejorado -->
      <header class="header">
        <div class="header-main">
          <h1 class="logo">NoticiasHoy</h1>
          <div class="header-info">
            <div class="date">{{ today | date:'fullDate' }}</div>
            <div class="time">{{ today | date:'mediumTime' }}</div>
          </div>
        </div>
        <nav class="nav">
          <button class="category-btn" [class.active]="!categoriaSeleccionada" (click)="seleccionarCategoria('')">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Todas
          </button>
          <button class="category-btn" [class.active]="!categoriaSeleccionada" (click)="seleccionarCategoria('')">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Inicio
          </button>
          <button *ngFor="let cat of categorias" (click)="seleccionarCategoria(cat)" class="category-btn" [class.active]="categoriaSeleccionada === cat">{{cat}}</button>
        </nav>
      </header>


      <!-- Estadísticas de filtrado -->
      <div class="stats-container">
        <div class="stat-item">
          <div class="stat-number">{{ noticiasFiltradas.length }}</div>
          <div class="stat-label">Mostradas</div>
        </div>
        <div class="stat-separator"></div>
        <div class="stat-item">
          <div class="stat-number">{{ noticias.length }}</div>
          <div class="stat-label">Total</div>
        </div>
        <div class="stat-separator"></div>
        <div class="stat-item">
          <div class="stat-number">{{ categorias.length }}</div>
          <div class="stat-label">Categorías</div>
        </div>
        <div class="stat-separator" *ngIf="categoriaSeleccionada"></div>
        <div class="stat-item" *ngIf="categoriaSeleccionada">
          <div class="stat-number">{{ getNoticiasPorCategoria(categoriaSeleccionada) }}</div>
          <div class="stat-label">En {{ categoriaSeleccionada }}</div>
        </div>
      </div>


      <!-- Grid de noticias -->
      <div class="container mx-auto px-4">
        <div *ngIf="noticiasFiltradas.length === 0" class="text-center text-white text-lg font-semibold py-12">
          No hay noticias para mostrar.
        </div>
        <div class="news-grid">
          <div *ngFor="let noticia of noticiasFiltradas" class="news-card">
            <div class="news-image">
              <img *ngIf="noticia.imagen_url && noticia.imagen_url !== 'Sin imagen'" [src]="noticia.imagen_url" [alt]="noticia.titulo" />
              <div *ngIf="!noticia.imagen_url || noticia.imagen_url === 'Sin imagen'" class="placeholder">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
            </div>
            <div class="news-content">
              <span class="category">{{noticia.categoria}}</span>
              <h2 class="title">{{noticia.titulo}}</h2>
              <p class="desc">{{noticia.descripcion}}</p>
              <div class="meta">
                <span class="font-medium">{{noticia.autor}}</span>
                <span>{{noticia.fecha | date:'short'}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer glassmorphism -->
      <footer class="footer">
        <div class="container mx-auto px-4 py-8 text-center">
          <p class="text-lg font-semibold text-gray-700">&copy; 2025 NoticiasHoy. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  `
})
export class NewsPortalComponent implements OnInit {
  noticias: Noticia[] = [];
  noticiasFiltradas: Noticia[] = [];
  categorias: string[] = [];
  busqueda: string = '';
  categoriaSeleccionada: string = '';
  today = new Date();

  ngOnInit() {
    console.log('ngOnInit ejecutado');
    this.cargarNoticias();
    this.obtenerCategorias();
  }

  async cargarNoticias() {
    const { data, error } = await supabase.from('noticiass').select('*');
    if (error) {
      console.error(error);
      this.noticias = [];
      this.noticiasFiltradas = [];
    } else {
      this.noticias = data || [];
      this.noticiasFiltradas = [...this.noticias];
    }
  }

  obtenerCategorias() {
    this.categorias = [...new Set(this.noticias.map(noticia => noticia.categoria))];
  }

  filtrarNoticias() {
    this.noticiasFiltradas = this.noticias.filter(noticia =>
      noticia.titulo.toLowerCase().includes(this.busqueda.toLowerCase()) ||
      noticia.descripcion.toLowerCase().includes(this.busqueda.toLowerCase()) ||
      noticia.autor.toLowerCase().includes(this.busqueda.toLowerCase())
    );
    if (this.categoriaSeleccionada) {
      this.noticiasFiltradas = this.noticiasFiltradas.filter(noticia =>
        noticia.categoria === this.categoriaSeleccionada
      );
    }
  }

  filtrarPorCategoria() {
    if (this.categoriaSeleccionada) {
      this.noticiasFiltradas = this.noticias.filter(noticia =>
        noticia.categoria === this.categoriaSeleccionada
      );
    } else {
      this.noticiasFiltradas = [...this.noticias];
    }
    if (this.busqueda) {
      this.filtrarNoticias();
    }
  }

  cargarMasNoticias() {
    // Lógica para cargar más noticias si lo deseas
    console.log('Cargando más noticias...');
  }

  seleccionarCategoria(cat: string) {
    this.categoriaSeleccionada = cat;
    this.filtrarPorCategoria();
  }

  getNoticiasPorCategoria(categoria: string): number {
    return this.noticias.filter(noticia => noticia.categoria === categoria).length;
  }
}
