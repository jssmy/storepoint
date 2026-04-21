import { Component, computed, Injectable } from "@angular/core";

interface Option {
    label: string;
    icon: string;
    key: string;
    stpClass?: string;
}

@Component({
    selector: 'stp-swipe-item',
    templateUrl: './swipe-item.component.html',
    styleUrls: ['./swipe-item.component.scss'],

})
export class SwipeItemComponent {
    protected startX = 0;
    protected currentX = 0;
    protected offset = 0;

    protected dragging = false;
    protected animate = false;

    // protected maxSwipe = -160; // ancho total de botones

    readonly options: Option[] = [
        { label: 'default', icon: 'trash', key: 'delete', stpClass: 'error-bg' },
    ];

    readonly maxSwipe = computed(() => -80 * this.options.length);

    onStart(event: PointerEvent) {
        this.dragging = true;
        this.animate = false;
        this.startX = event.clientX;
    }
    onMove(event: PointerEvent) {
        if (!this.dragging) return;

        this.currentX = event.clientX;
        let delta = this.currentX - this.startX;

        let newOffset = this.offset + delta;

        // limitar entre cerrado (0) y abierto (maxSwipe)
        this.offset = Math.min(0, Math.max(this.maxSwipe(), newOffset));

        this.startX = this.currentX;
    }

    onEnd() {
        if (!this.dragging) return;

        this.dragging = false;
        this.animate = true;

        // snap automático
        if (this.offset < this.maxSwipe() / 2) {
            this.offset = this.maxSwipe(); // se abre
        } else {
            this.offset = 0; // se cierra
        }
    }
}
