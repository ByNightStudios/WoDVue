<template>
  <div class="inner-content">
    <b-nav align="center" id="monsterContentTypesNav">
      <b-nav-item
        v-for="(contentTypeId, idx) in monsterContentTypeIds"
        :key="`${contentTypeId}_${idx}`"
        active
         v-on:click="clickMonsterContentTypesNavItem(contentTypeId)"
      >
    <b-dropdown id="dropdown-1" :text="contentTypeId.text" class="m-md-2">
    <b-dropdown-item>Semo</b-dropdown-item>
        <cContentList></cContentList>
        <cContentView></cContentView>
  </b-dropdown>
  </b-nav-item>
    </b-nav>
  </div>
</template>

<script>
import cContentList from './common/contentList.vue';
import cContentView from './common/contentView.vue';

export default {
  name: 'cMonster',
  props: {},
  data() {
    return {
      monsterContentTypeIds: [],
    };
  },
  computed: {
    curMonster() {
      const curMonster = this.$route.params.monster;
      this.$store.commit('updateMonster', curMonster);
      return curMonster;
    },
  },
  methods: {
    clickMonsterContentTypesNavItem: function clickMonsterContentTypesNavItem(
      contentTypeId,
    ) {
      this.$store.commit('updateCurContentTypeId', contentTypeId.contentTypeId);
      this.$store.commit('clearEntry');
    },
    getContentTypeIdsString: function getContentTypeIdsString() {
      const envVarKey = `VUE_APP_CONTENT_TYPE_NAV_ITEMS_${this.curMonster.toUpperCase()}`;
      const envVar = process.env[envVarKey];
      return envVar;
    },
    getContentTypeIds: function getContentTypeIds(monster) {
      return this.processContentTypeIds(this.getContentTypeIdsString(monster));
    },
    processContentTypeIds: function processContentTypeIds(contentTypesString) {
      return contentTypesString
        .split(',')
        .map((ni) => ni.split('|'))
        .map((a) => ({ text: a[0], contentTypeId: a[1] }));
    },
  },
  mounted() {
    this.monsterContentTypeIds = this.getContentTypeIds(this.curMonster);
  },
  watch: {
    curMonster(newMonster) {
      this.monsterContentTypeIds = this.getContentTypeIds(newMonster);
    },
  },
  components: {
    cContentList,
    cContentView,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
