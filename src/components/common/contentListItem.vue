<template>
  <b-button-group class="mx-1">
    <b-nav-item v-on:click="showEntry()">{{ getListItemText() }}</b-nav-item>
  </b-button-group>
</template>

<script>
export default {
  name: 'cContentListItem',
  props: {
    entry: Object,
  },
  methods: {
    showEntry: function showEntry() {
      if (this.entry) {
        const { params } = this.$route;
        const { contentType, id } = params;
        if (!id) {
          this.$router.push({ path: `${contentType}/${this.entry.id}` });
        } else {
          this.$router.push({ path: `${this.entry.id}` });
        }
      }
      this.$store.commit('updateCurEntryId', this.entry.id);
      this.$store.commit('updateCurEntryData', this.entry);
    },
    getListItemText() {
      if (this.entry.title) return this.entry.title;
      if (this.entry.merit) return this.entry.merit;
      if (this.entry.flaw) return this.entry.flaw;
      if (this.entry.technique) return this.entry.technique;
      if (this.entry.attribute) return this.entry.attribute;

      return 'GOT NOTHING';
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
