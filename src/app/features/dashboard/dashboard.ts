import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Alert } from '../../shared/ui/alert/alert';
import { Card } from '../../shared/ui/card/card';

interface SummaryTile {
  label: string;
  value: string;
}

interface ActivityItem {
  title: string;
  when: string;
}

/**
 * Basic customer dashboard. All content is static sample data for layout purposes.
 * TODO(Entra): protect this route with a guard and show the signed-in customer's real details.
 */
@Component({
  selector: 'app-dashboard',
  imports: [Alert, Card],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  protected readonly tiles: SummaryTile[] = [
    { label: 'Open requests', value: '2' },
    { label: 'Orders this month', value: '5' },
    { label: 'Support tickets', value: '0' },
  ];

  protected readonly activity: ActivityItem[] = [
    { title: 'Order #1042 shipped', when: '2 days ago' },
    { title: 'Invoice #318 issued', when: '5 days ago' },
    { title: 'Profile updated', when: '2 weeks ago' },
  ];
}
