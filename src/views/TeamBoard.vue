<template>
    <div class="app">
        <header>
            <a href="https://github.com/syumai/trollo">
                <h1 class="logo">Trollo</h1>
            </a>
        </header>
        <main>
            <list v-for="(list, index) in lists" :key="index" :title="list.title" :cards="list.cards" :index="index" />
            <list-draft />
        </main>
    </div>
</template>

<script>
// eslint-disable-next-line 
/* eslint-disable */
import { computed } from 'vue';
import { useStore } from 'vuex';
import List from './List';
import ListDraft from './ListDraft';

export default {
    components: {
        List,
        ListDraft
    },
    setup() {
        const store = useStore();
        const lists = computed(() => store.state.lists);

        return {
            lists
        };
    }
};
</script>

<style>
html,
body {
    width: 100%;
    height: 100%;
}

body {
    background-color: #c24558;
}

h1,
h2,
h3,
h4 {
    margin: 0;
}

@font-face {
    font-family: 'Noto Sans Japanese';
    font-style: normal;
    font-weight: 700;
    src: url(https://fonts.gstatic.com/ea/notosansjapanese/v6/NotoSansJP-Bold.woff2) format('woff2'),
        url(https://fonts.gstatic.com/ea/notosansjapanese/v6/NotoSansJP-Bold.woff) format('woff'),
        url(https://fonts.gstatic.com/ea/notosansjapanese/v6/NotoSansJP-Bold.otf) format('opentype');
}
</style>

<style lang="scss" scoped>
.app {
    font-family: "Noto Sans Japanese", "Noto Sans", sans-serif;
    font-weight: 700;
    color: #242424;
    width: 100%;
    height: 100%;

    header {
        padding: 0 20px;
        display: flex;
        align-items: center;
        width: calc(100% - 40px);
        height: 100px;

        a {
            text-decoration: none;

            h1.logo {
                font-family: 'Pacifico', cursive;
                font-weight: normal;
                font-size: 48px;
                color: #fff;
            }
        }

        a:hover {
            h1.logo {
                opacity: 0.7;
            }
        }
    }

    main {
        padding: 0 20px;
        display: flex;
        overflow-x: auto;
        width: calc(100% - 40px);
        height: calc(100% - 100px);
    }
}
</style>

