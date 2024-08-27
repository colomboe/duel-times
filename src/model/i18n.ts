type SupportedLanguage = "it" | "en";

interface CopyForLanguage {
    pressToStart: string,
    moreInfoLink: string,
    selectPlayer: string,
    story1: string,
    story2: string,
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
        moreInfoLink: "o tocca qui per maggiori informazioni sul gioco.",
        selectPlayer: "Seleziona il tuo personaggio",
        story1: "Il regno della matematica è sempre stato allegro e rigoglioso, fino\na quando non è arrivato un mago malvagio che ha portato\nl'oscurità ovunque.",
        story2: "Ho bisogno del tuo aiuto! Dobbiamo superare tutti gli animali\nmagici che ha stregato e sconfiggere il mago oscuro.\nCosì riporteremo pace e gioia nel regno!",
        nextRival: "Il tuo prossimo avversario",
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
        moreInfoLink: "or tap here for more info about the game.",
        selectPlayer: "Select your character",
        story1: "The kingdom of mathematics has always been cheerful and\nflourishing, until an evil wizard arrived and brought darkness\neverywhere.",
        story2: "I need your help! We must overcome all the magical creatures\nhe has enchanted and defeat the dark wizard!\nThis way, we will bring peace and joy back to the kingdom!",
        nextRival: "Your next opponent",
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