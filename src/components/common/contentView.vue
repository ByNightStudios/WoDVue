<template>
  <div class="mainContent col">
    <div class="boxDescription">
      <simplebar class="darkBar" data-simplebar-auto-hide="false">
        <div class="data" v-for="(item, idx) in entryData" :key="`content_${idx}`">
          <span class="title">{{ item.displayLabel }}:</span>
          <div v-if="helpers.typeOf(item.value) === 'string'">
            <span v-if="!item.value.includes('http')">{{item.value}}</span>
            <a v-if="item.value.includes('http')" :href="item.value" target="_blank">{{item.value}}</a>
          </div>
          <p v-else v-for="(subItem, idx) in item.value" :key="`subItem_${idx}`">{{ subItem }}</p>
        </div>
      </simplebar>
    </div>
  </div>
</template>

<script>
import simplebar from 'simplebar-vue';
import 'simplebar/dist/simplebar.min.css';
import helpers from '../../utils/helpers/helpers';

export default {
  name: 'cContentView',
  computed: {
    entryData() {
      return this.processEntryData(this.$store.getters.curEntryData);
    },
  },
  data() {
    return {
      displayContent: [],
      helpers,
    };
  },
  methods: {
    getDisplayContent(curMonster, contentTypeId, entryData) {
      const displayContentMapName = `VUE_APP_DISPLAY_CONTENT_MAP_${curMonster.toUpperCase()}_${contentTypeId.toUpperCase()}`;
      const displayContentMapStr = process.env[displayContentMapName];
      return displayContentMapStr.split(',').map((dcp) => {
        const dcpAry = dcp.split('|');
        const [displayLabel, contentField] = dcpAry;
        const dcpObj = {
          displayLabel,
          value: entryData[contentField],
        };
        return dcpObj;
      });
    },
    processEntryData(entryData) {
      if (!entryData) {
        return null;
        // return [
        //   {
        //     displayLabel: 'My apologies.',
        //     value: 'We have no entries for this.',
        //   },
        // ];
      }
      const { curMonster } = this.$store.getters;
      const { contentTypeId } = entryData;
      const displayContent = this.getDisplayContent(
        curMonster,
        contentTypeId,
        entryData,
      );
      return displayContent;
    },
  },
  watch: {},
  components: {
    simplebar,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
