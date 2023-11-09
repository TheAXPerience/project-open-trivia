const LOCAL_STORAGE_KEY = "leaderboards";
const HIGH_SCORE_LIMIT = 5; // limit for number of absolute high scores to save
const CATEGORY_SCORE_LIMIT = 3; // limit for number of scores to save per category

class LocalLeaderboards {
    constructor() {
        this.load();
    }

    addToLeaderboards(name, category, score) {
        // add to end of list
        const data = {
            name: name,
            category: category,
            score: score
        };
        this.leaderboards['High Scores'].push(data);
        this.leaderboards[category].push(data);

        // push score towards front of list; 0 index = highest score
        const highScores = this.leaderboards['High Scores'];
        let i = highScores.length - 1;
        while (i > 0) {
            if (highScores[i].score <= highScores[i-1].score) {
                break;
            }
            const tmp = highScores[i];
            highScores[i] = highScores[i-1];
            highScores[i-1] = tmp;
            i--;
        }

        const catScores = this.leaderboards[category];
        i = catScores.length - 1;
        while (i > 0) {
            if (catScores[i].score <= catScores[i-1].score) {
                break;
            }
            const tmp = catScores[i];
            catScores[i] = catScores[i-1];
            catScores[i-1] = tmp;
            i--;
        }

        // if array's length > limit set by const values at top of file
        while (highScores.length > HIGH_SCORE_LIMIT) {
            highScores.pop();
        }
        while (catScores.length > CATEGORY_SCORE_LIMIT) {
            catScores.pop();
        }

        this.save();
    }

    getAllLeaderboards() {
        const ret = [];
        ret.push({category: 'High Scores', scores: this.leaderboards['High Scores']});
        ret.push({category: 'All Categories', scores: this.leaderboards['All Categories']});
        for (const [cat, scores] of Object.entries(this.leaderboards)) {
            if (cat === 'All Categories' || cat === 'High Scores') {
                continue;
            }
            ret.push({category: cat, scores: scores});
        }
        return ret;
    }

    async load() {
        this.leaderboards = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
        if (this.leaderboards === null) {
            this.leaderboards = {};
            const categories = await getCategories();
            this.leaderboards['High Scores'] = [];
            this.leaderboards['All Categories'] = [];
            for (const category of categories) {
                this.leaderboards[category.name] = [];
            }
            this.save();
        }
    }

    save() {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.leaderboards));
    }
}

const LEADERBOARDS = new LocalLeaderboards();
