import graphics from '@/data/graphics';

const graphicsFilters = graphics.map((graphic) => ({ title: graphic.title, name: graphic.name }));

const baseFilters = [{ title: 'Emprunte à 2', name: 'hasCoBorrower' }];

const filters = { graphicsFilters, baseFilters };

export default filters;
