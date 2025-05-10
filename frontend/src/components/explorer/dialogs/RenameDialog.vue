<template>
  <div v-if="show" class="dialog-overlay">
    <div class="dialog">
      <h2>重命名</h2>
      <form @submit.prevent="handleSubmit">
        <input
          ref="renameInput"
          v-model="localName"
          type="text"
          placeholder="新名称"
          autofocus
          @keyup.enter="handleSubmit"
        />
        <div class="dialog-buttons">
          <button type="button" @click="$emit('close')">取消</button>
          <button type="button" @click="handleSubmit" :disabled="!localName || localName === currentName">确认</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RenameDialog',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    currentName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      localName: ''
    }
  },
  watch: {
    show(newVal) {
      if (newVal) {
        this.localName = this.currentName;
        this.$nextTick(() => {
          if (this.$refs.renameInput) {
            this.$refs.renameInput.focus();
            this.$refs.renameInput.select();
          }
        });
      }
    },
    currentName(newVal) {
      this.localName = newVal;
    }
  },
  methods: {
    handleSubmit() {
      console.log("RenameDialog - handleSubmit called");
      console.log("RenameDialog - localName:", this.localName);
      console.log("RenameDialog - currentName:", this.currentName);
      if (this.localName && this.localName !== this.currentName) {
        console.log("RenameDialog - emitting rename event with:", this.localName);
        this.$emit('rename', this.localName);
        console.log("RenameDialog - rename event emitted");
      } else {
        console.log("RenameDialog - not emitting rename event because:", {
          hasLocalName: !!this.localName,
          isDifferent: this.localName !== this.currentName
        });
      }
    }
  },
  emits: {
    rename: (value) => {
      console.log("RenameDialog - validating rename event with value:", value);
      return typeof value === 'string';
    },
    close: null
  }
}
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.dialog {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  min-width: 300px;
}

h2 {
  margin: 0 0 20px 0;
  font-size: 18px;
  color: #333;
}

form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.dialog-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  background-color: #f5f7fa;
  color: #333;
}

button[type="submit"] {
  background-color: var(--primary-color);
  color: white;
}

button[type="submit"]:hover {
  background-color: var(--primary-color-dark);
}

button[type="submit"]:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

button:hover {
  background-color: #e4e7ed;
}
</style>
