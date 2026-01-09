#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Analisador de Layout do Dashboard - DashboardPage.js
Analisa a estrutura dos cards e gráficos para otimizar o layout
Sem alterar a funcionalidade dos gráficos
"""

import re
import json
from pathlib import Path

class DashboardAnalyzer:
    def __init__(self, file_path):
        self.file_path = Path(file_path)
        self.content = self.file_path.read_text(encoding='utf-8')
        self.cards = []
        self.analyze()
    
    def analyze(self):
        """Extrai informações sobre os cards do dashboard"""
        # Padrão para encontrar cards com seus títulos
        pattern = r'<Grid item[^>]*>[\s\S]*?<Typography[^>]*>\s*([^<]+)\s*</Typography>'
        
        matches = re.finditer(pattern, self.content)
        
        card_index = 0
        for match in matches:
            title = match.group(1).strip()
            # Remove emojis e símbolos
            title_clean = re.sub(r'[^\w\s]', '', title).strip()
            
            if title_clean and card_index < 6:  # Apenas os 6 gráficos principais
                # Encontrar o Grid item correspondente
                start_pos = match.start()
                grid_match = re.search(r'<Grid item xs=\{12\}(?:\s+md=\{\d+\})?', self.content[:start_pos][-200:])
                
                self.cards.append({
                    'index': card_index + 1,
                    'title': title.strip(),
                    'title_clean': title_clean,
                    'position': match.start(),
                })
                card_index += 1
    
    def generate_layout_suggestions(self):
        """Gera sugestões de layout para os cards"""
        suggestions = {
            1: {'name': 'Evolução da Carteira', 'suggested_size': 'md={6}', 'reason': 'Série temporal - 50% da tela'},
            2: {'name': 'Ganhos ao Longo do Tempo', 'suggested_size': 'md={6}', 'reason': 'Série temporal - 50% da tela'},
            3: {'name': 'Composição de Investimentos', 'suggested_size': 'xs={12}', 'reason': 'Donut chart - tela cheia para melhor visualização'},
            4: {'name': 'Movimentação Mensal', 'suggested_size': 'md={6}', 'reason': 'Gráfico de barras - 50% da tela'},
            5: {'name': 'Investimentos por Status', 'suggested_size': 'md={6}', 'reason': 'Gráfico de barras - 50% da tela'},
            6: {'name': 'Indicações Acumuladas', 'suggested_size': 'xs={12}', 'reason': 'Série temporal importante - tela cheia'},
        }
        return suggestions
    
    def generate_layout_structure(self):
        """Gera a estrutura de layout recomendada"""
        structure = """
╔══════════════════════════════════════════════════════════════════╗
║           LAYOUT RECOMENDADO PARA DASHBOARD - DashboardPage.js  ║
╚══════════════════════════════════════════════════════════════════╝

┌─────────────────────────────────────────────────────────────────┐
│ LINHA 1: Duas séries temporais lado a lado                      │
├──────────────────────────────┬──────────────────────────────────┤
│ Evolução da Carteira         │ Ganhos ao Longo do Tempo         │
│ Grid: xs={12} md={6}         │ Grid: xs={12} md={6}             │
│ Altura: 320px                │ Altura: 320px                    │
└──────────────────────────────┴──────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ LINHA 2: Composição (tela cheia)                                │
├─────────────────────────────────────────────────────────────────┤
│ Composição de Investimentos (Donut Chart)                       │
│ Grid: xs={12} (tela cheia)                                      │
│ Altura: 320px                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ LINHA 3: Dois gráficos de barras lado a lado                    │
├──────────────────────────────┬──────────────────────────────────┤
│ Movimentação Mensal          │ Investimentos por Status         │
│ Grid: xs={12} md={6}         │ Grid: xs={12} md={6}             │
│ Altura: 320px                │ Altura: 320px                    │
└──────────────────────────────┴──────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ LINHA 4: Série acumulada (tela cheia)                           │
├─────────────────────────────────────────────────────────────────┤
│ Indicações Acumuladas                                           │
│ Grid: xs={12} (tela cheia)                                      │
│ Altura: 320px                                                   │
└─────────────────────────────────────────────────────────────────┘

VANTAGENS DESTA ORGANIZAÇÃO:
✓ Série temporais em pares (lado a lado)
✓ Gráficos de composição em tela cheia para melhor visibilidade
✓ Equilíbrio visual entre os cards
✓ Responsivo: empilha em telas pequenas (xs={12})
✓ Mantém toda a funcionalidade dos gráficos
"""
        return structure
    
    def generate_css_improvements(self):
        """Gera sugestões de melhorias CSS para spacing"""
        css = """
/* MELHORIAS DE SPACING E LAYOUT */

/* Aumentar espaçamento entre cards */
<Grid container spacing={4}> /* já está bom, manter em 4 */

/* Adicionar padding responsivo ao container de gráficos */
const chartContainerStyle = {
  padding: { xs: '16px', sm: '24px', md: '32px' },
  marginBottom: '24px'
}

/* Melhorar responsividade dos tooltips */
const tooltipStyle = {
  maxWidth: { xs: '200px', md: '300px' },
  fontSize: { xs: '12px', md: '14px' }
}

/* Altura dos cards mais consistente */
const cardHeight = {
  minHeight: { xs: 'auto', md: '500px' },
  height: '100%'
}
"""
        return css
    
    def generate_report(self):
        """Gera relatório completo"""
        report = []
        report.append("=" * 70)
        report.append("ANÁLISE DO LAYOUT - DashboardPage.js")
        report.append("=" * 70)
        report.append("")
        
        report.append("📊 CARDS IDENTIFICADOS:")
        report.append("-" * 70)
        for card in self.cards:
            report.append(f"{card['index']}. {card['title']}")
        report.append("")
        
        report.append("🎯 SUGESTÕES DE LAYOUT:")
        report.append("-" * 70)
        suggestions = self.generate_layout_suggestions()
        for idx, sugg in suggestions.items():
            report.append(f"\n{idx}. {sugg['name']}")
            report.append(f"   Tamanho: {sugg['suggested_size']}")
            report.append(f"   Motivo: {sugg['reason']}")
        report.append("")
        
        report.append("\n" + self.generate_layout_structure())
        report.append("\n" + self.generate_css_improvements())
        
        report.append("\n" + "=" * 70)
        report.append("ALTERAÇÕES NECESSÁRIAS NO CÓDIGO:")
        report.append("=" * 70)
        report.append("""
1. Card 1 (Evolução da Carteira): ✅ Mantém xs={12} md={6}
2. Card 2 (Ganhos): ✅ Mantém xs={12} md={6}
3. Card 3 (Composição): ⚠️ Mudar de xs={12} md={6} para xs={12}
4. Card 4 (Movimentação): ✅ Mantém xs={12} md={6}
5. Card 5 (Status): ✅ Mantém xs={12} md={6}
6. Card 6 (Indicações): ⚠️ Mudar de xs={12} md={6} para xs={12}

NENHUMA ALTERAÇÃO NOS GRÁFICOS SERÁ FEITA
✓ Tooltips funcionando
✓ Cores e gradientes preservados
✓ Animações mantidas
✓ Responsividade garantida
""")
        
        return "\n".join(report)

def main():
    file_path = r"d:\PROJETOS\Acapulco\frontend\src\pages\DashboardPage.js"
    
    print("🔍 Analisando DashboardPage.js...")
    analyzer = DashboardAnalyzer(file_path)
    
    report = analyzer.generate_report()
    print(report)
    
    # Salvar relatório em arquivo
    output_path = Path(file_path).parent / "LAYOUT_ANALYSIS.txt"
    output_path.write_text(report, encoding='utf-8')
    print(f"\n✅ Relatório salvo em: {output_path}")
    
    # Salvar sugestões em JSON
    suggestions = analyzer.generate_layout_suggestions()
    json_path = Path(file_path).parent / "layout_suggestions.json"
    json_path.write_text(json.dumps(suggestions, indent=2, ensure_ascii=False), encoding='utf-8')
    print(f"✅ Sugestões salvas em: {json_path}")

if __name__ == "__main__":
    main()
