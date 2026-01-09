#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Fix encoding issues in DashboardPage.js
"""

import sys

# Read file
with open(r'd:\PROJETOS\Acapulco\frontend\src\pages\DashboardPage.js', 'r', encoding='utf-8', errors='replace') as f:
    content = f.read()

# Replacements
replacements = {
    '??': '📊',
    'An?lise': 'Análise',
    'evolu??o': 'evolução',
    'gr?ficos': 'gráficos',
    '?': 'á',
    '?': 'é',
    '?': 'í',
    '?': 'ó',
    '?': 'ú',
    'Sa?da': 'Saída',
}

# Apply replacements
for old, new in replacements.items():
    content = content.replace(old, new)

# Write file back
with open(r'd:\PROJETOS\Acapulco\frontend\src\pages\DashboardPage.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Encoding fixed!")
