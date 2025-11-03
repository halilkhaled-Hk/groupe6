const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const { execSync } = require('child_process');

// Configuration de l'email
const emailConfig = {
  service: 'gmail', // ou votre service email
  auth: {
    user: 'presi7030@gmail.com',
    pass: 'emailConfig.auth.pass' // Mot de passe d'application
  }
};

// Analyseur de code simple avec IA
class AICodeChecker {
  constructor() {
    this.transporter = nodemailer.createTransporter(emailConfig);
    this.errors = [];
  }

  // Analyser un fichier JavaScript
  analyzeJSFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const errors = this.checkForCommonErrors(content, filePath);
      
      if (errors.length > 0) {
        this.errors.push(...errors);
      }
      
      return errors;
    } catch (error) {
      console.error(`Erreur lecture ${filePath}:`, error.message);
      return [];
    }
  }

  // Vérifier les erreurs courantes
  checkForCommonErrors(code, filename) {
    const errors = [];

    // Vérifications de base
    if (code.includes('eval(') && !code.includes('// SAFE')) {
      errors.push({
        file: filename,
        line: this.getLineNumber(code, 'eval'),
        error: 'Utilisation de eval() détectée - Potentielle faille de sécurité',
        severity: 'HIGH',
        correction: 'Remplacer eval() par Function() ou parser manuellement'
      });
    }

    // Vérifier les variables non déclarées
    const undeclaredVars = this.findUndeclaredVariables(code);
    undeclaredVars.forEach(variable => {
      errors.push({
        file: filename,
        line: this.getLineNumber(code, variable),
        error: `Variable non déclarée: ${variable}`,
        severity: 'MEDIUM',
        correction: `Déclarer la variable avec let/const/var`
      });
    });

    // Vérifier la syntaxe HTML dans les fichiers JS
    if (code.includes('<script>') || code.includes('</script>')) {
      errors.push({
        file: filename,
        line: this.getLineNumber(code, '<script'),
        error: 'Balises HTML dans fichier JavaScript',
        severity: 'MEDIUM',
        correction: 'Séparer le HTML et le JavaScript'
      });
    }

    return errors;
  }

  getLineNumber(code, searchString) {
    const lines = code.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(searchString)) {
        return i + 1;
      }
    }
    return 1;
  }

  findUndeclaredVariables(code) {
    // Implémentation simplifiée - en production utiliser un parser AST
    const undeclared = [];
    const lines = code.split('\n');
    
    lines.forEach((line, index) => {
      if (line.includes('=') && !line.includes('let ') && 
          !line.includes('const ') && !line.includes('var ') &&
          !line.includes('function') && !line.includes('=>')) {
        const potentialVar = line.split('=')[0].trim();
        if (potentialVar && /^[a-zA-Z_$]/.test(potentialVar)) {
          undeclared.push(potentialVar);
        }
      }
    });
    
    return [...new Set(undeclared)];
  }

  // Analyser tous les fichiers du projet
  analyzeProject() {
    const filesToCheck = [
      'logic.js',
      'buttons.js', 
      'history.js',
      'index.html',
      'about.html',
      'style.css',
      'theme.css'
    ];

    filesToCheck.forEach(file => {
      if (fs.existsSync(file)) {
        console.log(`🔍 Analyse de ${file}...`);
        this.analyzeJSFile(file);
      }
    });

    return this.errors;
  }

  // Générer des corrections automatiques
  generateCorrections(errors) {
    const corrections = {};
    
    errors.forEach(error => {
      if (!corrections[error.file]) {
        corrections[error.file] = fs.readFileSync(error.file, 'utf8');
      }

      let correctedContent = corrections[error.file];
      
      // Appliquer les corrections selon le type d'erreur
      if (error.error.includes('eval()')) {
        correctedContent = this.correctEvalUsage(correctedContent);
      }
      
      corrections[error.file] = correctedContent;
    });

    return corrections;
  }

  correctEvalUsage(content) {
    // Remplacer eval() par une alternative plus sûre
    return content.replace(/eval\(/g, '/* EVAL REMPLACÉ */ safeEval(');
  }

  // Envoyer le rapport par email
  async sendEmailReport(errors, corrections) {
    const mailOptions = {
      from: emailConfig.auth.user,
      to: 'votre-email@gmail.com', // Email où recevoir les rapports
      subject: `🔍 Rapport d'analyse IA - ${new Date().toLocaleDateString()}`,
      html: this.generateEmailHTML(errors, corrections)
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('✅ Rapport envoyé par email');
    } catch (error) {
      console.error('❌ Erreur envoi email:', error);
    }
  }

  generateEmailHTML(errors, corrections) {
    let html = `
      <h2>🔍 Rapport d'Analyse IA du Code</h2>
      <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
      <p><strong>Fichiers analysés:</strong> 7</p>
    `;

    if (errors.length === 0) {
      html += `<div style="color: green; font-weight: bold;">✅ Aucune erreur critique détectée</div>`;
    } else {
      html += `<h3>🚨 Erreurs Détectées (${errors.length})</h3>`;
      
      errors.forEach(error => {
        html += `
          <div style="border: 1px solid #ccc; margin: 10px 0; padding: 10px; border-radius: 5px;">
            <h4 style="color: ${error.severity === 'HIGH' ? 'red' : 'orange'};">
              ${error.severity === 'HIGH' ? '🔴 HAUTE' : '🟠 MOYENNE'} - ${error.file}
            </h4>
            <p><strong>Ligne ${error.line}:</strong> ${error.error}</p>
            <p><strong>Correction:</strong> ${error.correction}</p>
          </div>
        `;
      });

      html += `<h3>🔧 Corrections Générées</h3>`;
      Object.keys(corrections).forEach(file => {
        html += `<h4>${file}</h4>`;
        html += `<pre style="background: #f5f5f5; padding: 10px; border-radius: 5px;">${corrections[file]}</pre>`;
      });
    }

    return html;
  }
}

// Exécution principale
async function main() {
  console.log('🤖 Démarrage de l\'analyse IA...');
  
  const checker = new AICodeChecker();
  const errors = checker.analyzeProject();
  const corrections = checker.generateCorrections(errors);

  // Afficher le rapport dans la console
  if (errors.length > 0) {
    console.log(`\n🚨 ${errors.length} erreur(s) détectée(s):`);
    errors.forEach(error => {
      console.log(`📁 ${error.file}:${error.line} - ${error.error}`);
      console.log(`   💡 Correction: ${error.correction}\n`);
    });

    // Envoyer le rapport par email
    await checker.sendEmailReport(errors, corrections);

    // Sauvegarder les corrections
    Object.keys(corrections).forEach(file => {
      fs.writeFileSync(`${file}.corrected`, corrections[file]);
      console.log(`💾 Correction sauvegardée: ${file}.corrected`);
    });

    console.log('❌ Commit bloqué - Des erreurs ont été détectées');
    process.exit(1); // Bloquer le commit
  } else {
    console.log('✅ Aucune erreur détectée - Commit autorisé');
    process.exit(0); // Autoriser le commit
  }
}

main().catch(console.error);