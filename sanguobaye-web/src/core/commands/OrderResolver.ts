import { useGameStore } from '../state/useGameStore';
import * as InternalCommands from './InternalCommands';
import * as MilitaryCommands from './MilitaryCommands';
import * as DiplomacyCommands from './DiplomacyCommands';

export function resolveOrders() {
    const store = useGameStore.getState();
    const orders = store.orderQueue;

    for (const order of orders) {
        switch (order.type) {
            case 'ASSART':
                InternalCommands.AssartCommand.resolve(order);
                break;
            case 'ACCRACTBUSINESS':
                InternalCommands.AccractbusinessCommand.resolve(order);
                break;
            case 'SEARCH':
                InternalCommands.SearchCommand.resolve(order);
                break;
            case 'FATHER':
                InternalCommands.FatherCommand.resolve(order);
                break;
            case 'INSPECTION':
                InternalCommands.InspectionCommand.resolve(order);
                break;
            case 'EXCHANGE':
                InternalCommands.ExchangeCommand.resolve(order);
                break;
            case 'SURRENDER':
                InternalCommands.SurrenderCommand.resolve(order);
                break;
            case 'LARGESS':
                InternalCommands.LargessCommand.resolve(order);
                break;
            case 'CONFISCATE':
                InternalCommands.ConfiscateCommand.resolve(order);
                break;
            case 'TREAT':
                InternalCommands.TreatCommand.resolve(order);
                break;
            case 'KILL':
                InternalCommands.KillCommand.resolve(order);
                break;
            case 'BANISH':
                InternalCommands.BanishCommand.resolve(order);
                break;
            case 'CONSCRIPTION':
                MilitaryCommands.ConscriptionCommand.resolve(order);
                break;
            case 'RECONNOITRE':
                MilitaryCommands.ReconnoitreCommand.resolve(order);
                break;
            case 'DISTRIBUTE':
                MilitaryCommands.DistributeCommand.resolve(order);
                break;
            case 'DEPREDATE':
                MilitaryCommands.DepredateCommand.resolve(order);
                break;
            case 'TRANSPORTATION':
                MilitaryCommands.TransportationCommand.resolve(order);
                break;
            case 'MOVE':
                MilitaryCommands.MoveCommand.resolve(order);
                break;
            case 'ATTACK':
                MilitaryCommands.AttackCommand.resolve(order);
                break;
            case 'ALIENATE':
                DiplomacyCommands.AlienateCommand.resolve(order);
                break;
            case 'CANVASS':
                DiplomacyCommands.CanvassCommand.resolve(order);
                break;
            case 'COUNTERESPIONAGE':
                DiplomacyCommands.CounterespionageCommand.resolve(order);
                break;
            case 'INDUCE':
                DiplomacyCommands.InduceCommand.resolve(order);
                break;
            default:
                console.warn(`Unknown order type: ${order.type}`);
        }
    }
}
