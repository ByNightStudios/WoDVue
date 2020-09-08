<template>
  <div class="leftNav col-md-3">
    <simplebar class="darkBar" data-simplebar-auto-hide="false">
      <b-nav vertical>
        <div v-for="(parentEntry, idx) in entryListData" :key="`parent_${idx}`">
          <b-button-toolbar key-nav>
            <b-button-group class="mx-1">
              <b-button
                v-if="parentEntry.children"
                variant="link"
                v-on:click="clickExpand(parentEntry)"
              >
                <b-icon-plus v-if="!parentEntry.expand"></b-icon-plus>
                <b-icon-dash v-if="parentEntry.expand"></b-icon-dash>
              </b-button>
            </b-button-group>
            <cContentListItem :entry="parentEntry"></cContentListItem>
          </b-button-toolbar>
          <b-nav v-if="parentEntry.expand" vertical>
            <cContentListItem
              v-for="(childEntry, idx) in parentEntry.children"
              :key="`child_${idx}`"
              :entry="childEntry"
            ></cContentListItem>
          </b-nav>
        </div>
      </b-nav>
    </simplebar>
  </div>
</template>

<script>
import simplebar from 'simplebar-vue';
import 'simplebar/dist/simplebar.min.css';
import cContentListItem from './contentListItem.vue';

export default {
  name: 'cContentList',
  props: {},
  computed: {
    curContentTypeId() {
      return this.$store.getters.curContentTypeId;
    },
    entryListData() {
      return this.$store.getters.getAllEntriesForCurrentContentTypeId;
    },
  },
  data() {
    return {
      dataError: {},
    };
  },
  mounted() {},
  methods: {
    clickExpand: function clickExpand(parentEntry) {
      parentEntry.expand = !parentEntry.expand;
    },
  },
  watch: {
    async curContentTypeId(curContentTypeId) {
      console.log('curContentTypeId');
      console.log(curContentTypeId);

      if (!this.entryListData || this.entryListData.length === 0) {
        console.log('fetching data');
        await this.$store.dispatch(
          'loadEntriesByContentTypeIdAsync',
          curContentTypeId,
        );
        console.log('entryListData');
        console.dir(this.entryListData);
      }
    },
  },
  components: {
    cContentListItem,
    simplebar,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
