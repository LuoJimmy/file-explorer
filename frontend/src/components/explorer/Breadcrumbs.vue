<template>
  <div class="breadcrumbs">
    <span
      v-for="(crumb, index) in breadcrumbs"
      :key="index"
      class="breadcrumb-item"
      @click="$emit('navigate', crumb.path)"
    >
      {{ crumb.name }}
      <span v-if="index < breadcrumbs.length - 1" class="separator">/</span>
    </span>
  </div>
</template>

<script>
export default {
  name: 'Breadcrumbs',
  props: {
    breadcrumbs: {
      type: Array,
      required: true
    }
  },
  emits: ['navigate']
}
</script>

<style scoped>
.breadcrumbs {
  background-color: #f0f2f5;
  padding: 10px 15px;
  border-radius: 4px;
  margin-bottom: 10px;
  white-space: nowrap;
  overflow-x: auto;
}

.breadcrumb-item {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  color: var(--primary-color);
}

.breadcrumb-item:hover {
  text-decoration: underline;
}

.separator {
  margin: 0 5px;
  color: #999;
}
</style>
