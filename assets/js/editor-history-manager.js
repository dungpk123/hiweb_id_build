(function () {
  'use strict';

  const MAX_STACK_SIZE = 50;

  function quickHash(obj) {
    const str = JSON.stringify(obj);
    let h = 0x811c9dc5;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = (h * 0x01000193) >>> 0;
    }
    return h;
  }

  function cloneSnapshot(value) {
    if (value == null) return value;
    if (typeof structuredClone === 'function') {
      try {
        return structuredClone(value);
      } catch (_) {
        // Fall back to JSON cloning below.
      }
    }
    return JSON.parse(JSON.stringify(value));
  }

  class EditorHistoryManager {
    constructor(maxStackSize = MAX_STACK_SIZE) {
      this.maxStackSize = maxStackSize;
      this.entries = [];
      this.currentIndex = -1;
      this._lastHash = null;
    }

    _trimToCurrent() {
      if (this.currentIndex < this.entries.length - 1) {
        this.entries = this.entries.slice(0, this.currentIndex + 1);
      }
    }

    _enforceLimit() {
      if (this.entries.length <= this.maxStackSize) return;
      const excess = this.entries.length - this.maxStackSize;
      this.entries = this.entries.slice(excess);
      this.currentIndex = Math.max(-1, this.currentIndex - excess);
    }

    _pushEntry(item, hash) {
      if (hash !== undefined && hash !== null && hash === this._lastHash) {
        return false;
      }

      this._trimToCurrent();
      this._lastHash = hash ?? quickHash(item);
      this.entries.push(item);
      this.currentIndex = this.entries.length - 1;
      this._enforceLimit();
      return true;
    }

    pushSnapshot(snapshot) {
      if (!snapshot) return false;
      return this._pushEntry(cloneSnapshot(snapshot));
    }

    pushElementSnapshot(el, snapshot) {
      if (!el || !snapshot) return false;
      return this._pushEntry({
        __element: true,
        el,
        state: cloneSnapshot(snapshot),
      }, quickHash(snapshot));
    }

    undo() {
      if (this.currentIndex <= 0) return null;
      this.currentIndex -= 1;
      this._lastHash = quickHash(this.entries[this.currentIndex]);
      return cloneSnapshot(this.entries[this.currentIndex]);
    }

    redo() {
      if (this.currentIndex >= this.entries.length - 1) return null;
      this.currentIndex += 1;
      this._lastHash = quickHash(this.entries[this.currentIndex]);
      return cloneSnapshot(this.entries[this.currentIndex]);
    }

    clear() {
      this.entries = [];
      this.currentIndex = -1;
      this._lastHash = null;
    }

    reset(initialHistory = []) {
      this.entries = Array.isArray(initialHistory) ? initialHistory.slice(-this.maxStackSize) : [];
      this.currentIndex = this.entries.length - 1;
      this._lastHash = this.currentIndex >= 0 ? quickHash(this.entries[this.currentIndex]) : null;
    }

    getStackInfo() {
      const undoCount = Math.max(0, this.currentIndex + 1);
      const redoCount = Math.max(0, this.entries.length - this.currentIndex - 1);
      return {
        canUndo: this.currentIndex > 0,
        canRedo: this.currentIndex >= 0 && this.currentIndex < this.entries.length - 1,
        undoCount,
        redoCount,
      };
    }
  }

  window.EditorHistoryManager = EditorHistoryManager;
  window.createEditorHistoryManager = function createEditorHistoryManager(maxStackSize) {
    return new EditorHistoryManager(maxStackSize);
  };
})();
