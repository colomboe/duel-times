type SupportedLanguage = "it" | "en";

interface CopyForLanguage {
    pressToStart: string,
    selectPlayer: string,
    nextRival: string,
    winner: string,
    credits: string,
}

function getLanguage(): SupportedLanguage {
    return navigator.language.startsWith("it") ? "it" : "en";
}

const dictionaries: { [key in SupportedLanguage]: CopyForLanguage } = {
    "it": {
        pressToStart: "Tocca per iniziare",
        selectPlayer: "Seleziona il tuo personaggio:",
        nextRival: "Prossimo avversario:",
        winner: "Il vincitore è",
        credits: `
GRAZIE PER AVER SALVATO IL REGNO

DELLA MATEMATICA! IL MALVAGIO

MAGO È STATO FINALMENTE SCONFITTO!





ORA GLI TUTTI ANIMALI SONO TORNATI

AMICHEVOLI E GIOIOSI E TUTTO IL

IL REGNO VIVE DI NUOVO NELLA PACE.













GRAZIE PER AVER GIOCATO A

!! DUEL TIMES !!
















DUEL TIMES È OPEN SOURCE E GRATUITO

REALIZZATO DA EMANUELE COLOMBO

(www.msec.it)













THE END
`,
    },
    "en": {
        pressToStart: "Tap to start",
        selectPlayer: "Select your character:",
        nextRival: "Next opponent:",
        winner: "The winner is",
        credits: `
THANK YOU FOR SAVING THE

KINGDOM OF MATHEMATICS! THE EVIL WIZARD

HAS FINALLY BEEN DEFEATED!





NOW ALL THE ANIMALS HAVE RETURNED

FRIENDLY AND JOYFUL AND THE WHOLE

KINGDOM LIVES IN PEACE AGAIN.













THANK YOU FOR PLAYING 

!! DUEL TIMES !!
















DUEL TIMES IS OPEN SOURCE AND FREE TO PLAY

CREATED BY EMANUELE COLOMBO

(www.msec.it)













THE END
`,
    }
};

export const dictionary = dictionaries[getLanguage()];