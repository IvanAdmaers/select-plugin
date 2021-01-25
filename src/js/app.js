import '../scss/style.scss';
import '../scss/select.scss';

import Select from './select';

document.querySelectorAll('[data-select-custom]')
.forEach(selectElement => new Select(selectElement));
