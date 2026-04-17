function escapeHtml(value) {
	return String(value)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;')
}

function productCardTemplate(product) {
	const {
		category = 'PLANTA MEDICINAL',
		title = 'Producto',
		description = '',
		price = '₡0',
		icon = '🌿',
		badge = '',
	} = product || {}

	return `
		<article class="product-card">
			<div class="product-image-container">
				${badge ? `<span class="product-badge">${escapeHtml(badge)}</span>` : ''}
				<span class="product-icon">${escapeHtml(icon)}</span>
			</div>
			<div class="product-info">
				<span class="product-category">${escapeHtml(category)}</span>
				<h4 class="product-title">${escapeHtml(title)}</h4>
				<p class="product-desc">${escapeHtml(description)}</p>
				<div class="product-footer">
					<span class="product-price">${escapeHtml(price)}</span>
					<a class="add-to-cart-btn" href="#" aria-label="Agregar al carrito">+</a>
				</div>
			</div>
		</article>
	`.trim()
}

function createProductCardElement(product) {
	const wrapper = document.createElement('div')
	wrapper.innerHTML = productCardTemplate(product)
	return wrapper.firstElementChild
}

window.Templates = {
	productCardTemplate,
	createProductCardElement,
}

