import "./TagsWidget.css";

class TagsWidget {
    #tagsCollection;
    #isReadOnly;

    constructor(id) {
        this.id = id;
        this.#tagsCollection = this.#getTagsCollectionFromLocalStorage() || [];
        this.#isReadOnly = this.#getIsReadOnlyFromLocalStorage() ?? false;
    }

    get tagsCollection() {
        const tagsArray = [];

        for (let item of this.#tagsCollection)
            tagsArray.push(item.value);

        return tagsArray;
    }

    set tagsCollection(tagsArray) {
        const tagsCollection = [];

        for (let item of tagsArray)
            tagsCollection.push({id: this.constructor.randomNumber(), value: item});

        this.#tagsCollection = tagsCollection;
        this.#addTagsCollectionToLocalStorage();
        this.#renderTagsCollection();
    }

    setIsReadOnly(boolean) {
        const input = document.querySelector(`#${this.id} .tags-widget__input`);
        const toggle = document.querySelector(`#${this.id} .tags-widget__toggle`);

        switch (boolean) {
            case true:
                input.value = "";
                input.disabled = true;
                input.classList.add("tags-widget__input--disabled");
                toggle.checked = true;
                this.#isReadOnly = true;
                this.#addIsReadOnlyToLocalStorage();
                break;
            case false:
                input.disabled = false;
                input.classList.remove("tags-widget__input--disabled");
                toggle.checked = false;
                this.#isReadOnly = false;
                this.#addIsReadOnlyToLocalStorage();
                break;
        }
    }

    #addTagsCollectionToLocalStorage() {
        const json = JSON.stringify(this.#tagsCollection);
        localStorage.setItem(this.id + "-tags-collection", json);
    }

    #addIsReadOnlyToLocalStorage() {
        localStorage.setItem(this.id + "-is-read-only", this.#isReadOnly);
    }

    #getTagsCollectionFromLocalStorage() {
        const json = localStorage.getItem(this.id + "-tags-collection");
        return JSON.parse(json);
    }

    #getIsReadOnlyFromLocalStorage() {
        const json = localStorage.getItem(this.id + "-is-read-only");
        return JSON.parse(json);
    }

    addOneTag(tag) {
        this.#tagsCollection.push({id: this.constructor.randomNumber(), value: tag});
        this.#addTagsCollectionToLocalStorage();
        this.#renderTagsCollection();
    }

    deleteOneTag(tagId) {
        if (!this.#isReadOnly) {
            this.#tagsCollection = this.#tagsCollection.filter(item => item.id !== +tagId);
            this.#addTagsCollectionToLocalStorage();
            this.#renderTagsCollection();
        }
    }

    renderWidget() {
        const elem = document.getElementById(this.id);
        const toggleId = this.id + "-toggle";

        elem.innerHTML = `
            <div class="tags-widget__wrapper">
                <div class="tags-widget__tags-field"></div>
                <form class="tags-widget__form">
                    <input 
                        class="tags-widget__input"
                        type="text"
                        placeholder="Enter tag (1 - 20 symbols)"
                    >
                    <div class="tags-widget__btns">
                        <input type="checkbox" class="tags-widget__toggle" id=${toggleId} />
                        <label class="tags-widget__label-for-toggle" for=${toggleId}></label>
                        <button class="tags-widget__btn">Submit</button>
                    </div>
                </form>
            </div>          
        `;

        this.#renderTagsCollection();

        const tagsField = document.querySelector(`#${this.id} .tags-widget__tags-field`);
        const input = document.querySelector(`#${this.id} .tags-widget__input`);
        const toggle = document.querySelector(`#${this.id} .tags-widget__toggle`);
        const form = document.querySelector(`#${this.id} .tags-widget__form`);

        if (this.#isReadOnly) {
            toggle.checked = true;
            input.disabled = true;
            input.classList.add("tags-widget__input--disabled");
        }

        tagsField.addEventListener("click", (e) => {
            const elem = e.target;

            if (elem.classList.contains("tag__btn-delete")) {
                const id = elem.dataset.id;
                this.deleteOneTag(id);
            }
        });

        toggle.addEventListener("click", () => {
            this.setIsReadOnly(toggle.checked);
        });

        form.addEventListener("submit", (e) => {
            const value = this.constructor.checkInputData(input.value);
            e.preventDefault();

            if (value && value.length < 20 && !this.#isReadOnly) {
                input.value = "";
                this.addOneTag(value);
                this.#renderTagsCollection(value);
            } else {
                if (!this.#isReadOnly) {
                    input.classList.add("tags-widget__input--error");
                    setTimeout(() => input.classList.remove("tags-widget__input--error"), 200);
                }
            }

            input.focus();
        });
    }

    #renderTagsCollection() {
        const tagsField = document.querySelector(`#${this.id} .tags-widget__tags-field`);
        let items = "";

        for (let item of this.#tagsCollection) {
            items += `
                <div class="tags-widget__tag">
                    <span>${item.value}</span>
                    <span class="tag__btn-delete" data-id=${item.id} />
                </div>
            `;
        }

        tagsField.innerHTML = items;
    }

    static checkInputData(text) {
        if (!text) return text;

        text = text.trim().toString()
            .split("&").join("&amp;")
            .split("<").join("&lt;")
            .split(">").join("&gt;")
            .split('"').join("&quot;")
            .split("'").join("&#039;");

        return text;
    }

    static randomNumber() {
        return Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
    }
}

export default TagsWidget;