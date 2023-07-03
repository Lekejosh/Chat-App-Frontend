<template>
    <div class="list-container" @dragover.prevent>
        <div class="close-button" @click="removeList">x</div>
        <div class="title">{{ title }}</div>
        <div class="cards" v-if="cardCount > 0">
            <card v-for="(card, index) in cards" :key="index" :body="card.body" :index="index" />
        </div>
        <card-draft />
    </div>
</template>

<script>
// eslint-disable-next-line 
/* eslint-disable */
import { mapState } from 'vuex';
import Card from './Card';
import CardDraft from './CardDraft';
import * as types from '../store/mutation-types';

export default {
    props: ['title', 'cards', 'index'],
    name:"ListView",
    components: {
        Card,
        CardDraft
    },
    computed: {
        ...mapState({
            cardCount: state => state.cards.length
        })
    },
    methods: {
        removeList() {
            this.$store.commit(types.REMOVE_LIST, {
                listIndex: this.index
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.list-container {
    margin: 0 10px auto;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    min-width: 290px;
    width: 290px;
    background-color: #e0e0e0;
    border-radius: 8px;
    padding: 15px;

    .close-button {
        position: absolute;
        top: 6px;
        right: 14px;
        font-size: 28px;
        cursor: pointer;
    }

    .close-button:hover {
        opacity: 0.8;
    }

    .title {
        margin: 5px 0;
        font-size: 24px;
        width: calc(100% - 20px);
        word-break: break-word;
    }

    .cards {
        margin-top: 15px;
        width: 100%;
    }
}
</style>
