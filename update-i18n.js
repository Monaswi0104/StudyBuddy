const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src', 'i18n', 'locales');
const files = fs.readdirSync(localesDir);

const translations = {
  en: { quiz: { title: "Biology Quiz", questionOf: "Question {{current}} of {{total}}", submitAnswer: "Submit Answer", nextQuestion: "Next Question", viewResults: "View Results", goodEffort: "Good effort!", keepReviewing: "Keep reviewing to hit 100%.", perfectScore: "Perfect Score!", mastered: "You've mastered this topic.", greatJob: "Great Job!", almostThere: "You're almost there.", scoreLabel: "Score", correct: "Correct", incorrect: "Incorrect", retakeQuiz: "Retake Quiz", backToHome: "Back to Home" } },
  es: { quiz: { title: "Cuestionario de biología", questionOf: "Pregunta {{current}} de {{total}}", submitAnswer: "Enviar respuesta", nextQuestion: "Siguiente pregunta", viewResults: "Ver resultados", goodEffort: "¡Buen esfuerzo!", keepReviewing: "Sigue repasando para alcanzar el 100%.", perfectScore: "¡Puntuación perfecta!", mastered: "Has dominado este tema.", greatJob: "¡Buen trabajo!", almostThere: "Estás casi ahí.", scoreLabel: "Puntuación", correct: "Correcto", incorrect: "Incorrecto", retakeQuiz: "Volver a hacer", backToHome: "Volver al inicio" } },
  fr: { quiz: { title: "Quiz de biologie", questionOf: "Question {{current}} sur {{total}}", submitAnswer: "Soumettre la réponse", nextQuestion: "Question suivante", viewResults: "Voir les résultats", goodEffort: "Bel effort !", keepReviewing: "Continuez à réviser pour atteindre 100%.", perfectScore: "Score parfait !", mastered: "Vous maîtrisez ce sujet.", greatJob: "Bon travail !", almostThere: "Vous y êtes presque.", scoreLabel: "Score", correct: "Correct", incorrect: "Incorrect", retakeQuiz: "Refaire le quiz", backToHome: "Retour à l'accueil" } },
  de: { quiz: { title: "Biologie-Quiz", questionOf: "Frage {{current}} von {{total}}", submitAnswer: "Antwort einreichen", nextQuestion: "Nächste Frage", viewResults: "Ergebnisse ansehen", goodEffort: "Guter Einsatz!", keepReviewing: "Weiter üben, um 100% zu erreichen.", perfectScore: "Perfektes Ergebnis!", mastered: "Du beherrschst dieses Thema.", greatJob: "Großartige Arbeit!", almostThere: "Du bist fast da.", scoreLabel: "Punktzahl", correct: "Richtig", incorrect: "Falsch", retakeQuiz: "Quiz wiederholen", backToHome: "Zurück zur Startseite" } },
  ja: { quiz: { title: "生物学クイズ", questionOf: "{{total}}問中{{current}}問目", submitAnswer: "回答を送信", nextQuestion: "次の問題", viewResults: "結果を見る", goodEffort: "よく頑張りました！", keepReviewing: "100%を目指して復習を続けましょう。", perfectScore: "満点！", mastered: "このトピックをマスターしました。", greatJob: "よくできました！", almostThere: "あと少しです。", scoreLabel: "スコア", correct: "正解", incorrect: "不正解", retakeQuiz: "もう一度受ける", backToHome: "ホームに戻る" } },
  ko: { quiz: { title: "생물학 퀴즈", questionOf: "질문 {{current}} / {{total}}", submitAnswer: "답변 제출", nextQuestion: "다음 질문", viewResults: "결과 보기", goodEffort: "좋은 노력입니다!", keepReviewing: "100%를 달성하기 위해 계속 복습하세요.", perfectScore: "만점!", mastered: "이 주제를 마스터했습니다.", greatJob: "잘했어요!", almostThere: "거의 다 왔습니다.", scoreLabel: "점수", correct: "정답", incorrect: "오답", retakeQuiz: "퀴즈 다시 풀기", backToHome: "홈으로 돌아가기" } },
  zh: { quiz: { title: "生物测验", questionOf: "问题 {{current}} / {{total}}", submitAnswer: "提交答案", nextQuestion: "下一题", viewResults: "查看结果", goodEffort: "再接再厉！", keepReviewing: "继续复习以达到 100%。", perfectScore: "满分！", mastered: "您已经掌握了这个主题。", greatJob: "干得好！", almostThere: "差不多了。", scoreLabel: "分数", correct: "正确", incorrect: "错误", retakeQuiz: "重考测验", backToHome: "返回主页" } }
};

files.forEach(file => {
  if (file.endsWith('.json')) {
    const lang = file.split('.')[0];
    const filePath = path.join(localesDir, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    if (translations[lang]) {
      data.quiz = translations[lang].quiz;
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    }
  }
});
console.log('Translations updated successfully');
