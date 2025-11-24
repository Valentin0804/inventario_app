import { Component, Input, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MercadoPagoService } from '../../core/services/mercadopago.service';
import { VentaService } from '../../core/services/venta.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-generar-qr',
  templateUrl: './generar-qr.component.html',
  styleUrls: ['./generar-qr.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class GenerarQrComponent {

  @Input() items!: any[];
  @Input() total!: number;

  qrBase64: string | null = null;
  preferenceId: string = '';
  cargando: boolean = false;
  estadoPago: string | null = null;

  private polling!: Subscription;

  constructor(
    private mpService: MercadoPagoService,
    private ventaService: VentaService
  ) {}

  generarQR() {
    this.cargando = true;

    const data = {
      total: this.total,
      items: this.items
    };

    this.mpService.generarQR(data).subscribe(res => {
      this.preferenceId = res.preference_id;
      this.qrBase64 = res.qr;
      this.estadoPago = "pending";

      this.cargando = false;

      this.iniciarVerificacion();
    });
  }

  iniciarVerificacion() {
    this.polling = interval(3000).subscribe(() => {

      this.mpService.estadoPago(this.preferenceId).subscribe(res => {
        
        if (res.status === "approved") {
          this.estadoPago = "approved";

          this.polling.unsubscribe();
          this.guardarVenta();

          alert("Pago confirmado ✔");
        }
      });
    });
  }

  guardarVenta() {
    const venta = {
      metodopago_id: 3, // 3 = QR
      items: this.items
    };

    this.ventaService.addVenta(venta).subscribe(() => {
      console.log("Venta almacenada ✔");
    });
  }

  ngOnDestroy() {
    if (this.polling) this.polling.unsubscribe();
  }
}
