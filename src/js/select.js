class Select {
  constructor(selectElement) {
    this.element = selectElement;
    this.options = getFormattedOptions(this.element.querySelectorAll('option'));
    this.customElement = document.createElement('div');
    this.labelElement = document.createElement('span');
    this.optionsCustomElement = document.createElement('ul');

    setupCustomElement(this);
    this.element.after(this.customElement);
    this.element.style.display = 'none';
  }

  get selectedOption() {
    return this.options.find(option => option.selected);
  }

  get selectedOptionIndex() {
    return this.options.indexOf(this.selectedOption);
  }

  selectValue(value) {
    const newSelectedOption = this.options.find(option => option.value === value);
    const prevSelectedOption = this.selectedOption;

    prevSelectedOption.selected = false;
    prevSelectedOption.element.selected = false;

    newSelectedOption.selected = true;
    newSelectedOption.element.selected = true;

    this.labelElement.textContent = '';
    this.labelElement.insertAdjacentText('beforeend', newSelectedOption.label);

    this.optionsCustomElement.querySelector(`[data-value="${prevSelectedOption.value}"]`).classList.remove('selected');
    const newCustomElement = this.optionsCustomElement.querySelector(`[data-value="${newSelectedOption.value}"]`);
    newCustomElement.classList.add('selected');
    newCustomElement.scrollIntoView({ block: 'nearest' });
  }
}

const setupCustomElement = (select) => {
  select.customElement.classList.add('custom-select-container');
  select.customElement.tabIndex = 0;

  select.labelElement.classList.add('custom-select-value');
  select.labelElement.insertAdjacentText('beforeend', select.selectedOption.label)
  select.customElement.append(select.labelElement);

  select.optionsCustomElement.classList.add('custom-select-options');
  select.options.forEach((option) => {
    const optionElement = document.createElement('li');
    optionElement.classList.add('custom-select-option');
    optionElement.classList.toggle('selected', option.selected);
    optionElement.insertAdjacentText('beforeend', option.label);
    optionElement.dataset.value = option.value;
    select.optionsCustomElement.append(optionElement);

    optionElement.addEventListener('click' , () => {
      select.selectedOption.element.classList.remove('selected');
      select.selectValue(option.value);
      select.optionsCustomElement.classList.remove('show');
    });
  });
  select.customElement.append(select.optionsCustomElement);

  select.labelElement.addEventListener('click', () => select.optionsCustomElement.classList.toggle('show'));

  select.customElement.addEventListener('blur', () => select.optionsCustomElement.classList.remove('show'));

  let debonceTimeout;
  let searchTerm = '';
  select.customElement.addEventListener('keydown', ({ code, key }) => {
    switch (code) {
      case 'Space':
        select.optionsCustomElement.classList.toggle('show');
        break;

      case 'ArrowUp': {
        const prevOption = select.options[select.selectedOptionIndex - 1];
        if (prevOption) {
          select.selectValue(prevOption.value);
        }
        break;
      }

      case 'ArrowDown': {
        const nextOption = select.options[select.selectedOptionIndex + 1];
        if (nextOption) {
          select.selectValue(nextOption.value);
        }
        break;
      }

      case 'Escape':
        case 'Enter':
          select.optionsCustomElement.classList.remove('show');
          break;

      default: {
        clearTimeout(debonceTimeout);
        searchTerm += key;
        debonceTimeout = setTimeout(() => searchTerm = '', 500);

        const searchedOption = select.options.find(option => option.label.toLowerCase().startsWith(searchTerm.trim().toLowerCase()));
        if (searchedOption) {
          select.selectValue(searchedOption.value);
        }
      }
    }
  });
};

const getFormattedOptions = (optionElements) => {
  return [...optionElements].map((optionElement) => {
    return {
      value: optionElement.value,
      label: optionElement.label,
      selected: optionElement.selected,
      element: optionElement,
    };
  });
};

export default Select;
