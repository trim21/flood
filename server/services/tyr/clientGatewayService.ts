import type {
  AddTorrentByFileOptions,
  AddTorrentByURLOptions,
  ReannounceTorrentsOptions,
  SetTorrentsTagsOptions,
} from '@shared/schema/api/torrents';
import type {
  CheckTorrentsOptions,
  DeleteTorrentsOptions,
  MoveTorrentsOptions,
  SetTorrentContentsPropertiesOptions,
  SetTorrentsInitialSeedingOptions,
  SetTorrentsPriorityOptions,
  SetTorrentsSequentialOptions,
  SetTorrentsTrackersOptions,
  StartTorrentsOptions,
  StopTorrentsOptions,
} from '@shared/types/api/torrents';
import type {ClientSettings} from '@shared/types/ClientSettings';
import {TorrentContent, TorrentContentPriority} from '@shared/types/TorrentContent';
import type {TorrentListSummary, TorrentProperties} from '@shared/types/Torrent';
import type {TorrentPeer} from '@shared/types/TorrentPeer';
import type {TorrentTracker} from '@shared/types/TorrentTracker';
import type {TransferSummary} from '@shared/types/TransferData';
import type {SetClientSettingsOptions} from '@shared/types/api/client';

import ClientGatewayService from '../clientGatewayService';
import ClientRequestManager from './clientRequestManager';

import type {RPCError} from './types/RPCError';
import type {TYRConnectionSettings} from '@shared/schema/ClientConnectionSettings';
import {TorrentStatus} from '@shared/constants/torrentStatusMap';

class TYRClientGatewayService extends ClientGatewayService {
  clientRequestManager = new ClientRequestManager(this.user.client as TYRConnectionSettings);

  async addTorrentsByFile({}: Required<AddTorrentByFileOptions>): Promise<string[]> {
    return [];
  }

  async addTorrentsByURL({}: Required<AddTorrentByURLOptions>): Promise<string[]> {
    return [];
  }

  async checkTorrents({hashes}: CheckTorrentsOptions): Promise<void> {
    return;
  }

  async getTorrentContents(hash: TorrentProperties['hash']): Promise<Array<TorrentContent>> {
    const res: {
      files: Array<{
        index: number;
        path: string[];
        size: number;
        progress: number;
      }>;
    } = await this.clientRequestManager.methodCall('torrent.files', {info_hash: hash});
    return res.files.map((f) => {
      return {
        index: f.index,
        path: f.path.join('/'),
        priority: TorrentContentPriority.NORMAL,
        sizeBytes: f.size,
        filename: f.path[f.path.length - 1] || '',
        percentComplete: f.progress * 100,
      };
    });
  }

  async getTorrentPeers(hash: TorrentProperties['hash']): Promise<Array<TorrentPeer>> {
    return [];
  }

  async getTorrentTrackers(hash: TorrentProperties['hash']): Promise<Array<TorrentTracker>> {
    return [];
  }

  async moveTorrents({}: MoveTorrentsOptions): Promise<void> {
    return;
  }

  async reannounceTorrents({hashes}: ReannounceTorrentsOptions): Promise<void> {
    return;
  }

  async removeTorrents({}: DeleteTorrentsOptions): Promise<void> {
    return;
  }

  async setTorrentsInitialSeeding({}: SetTorrentsInitialSeedingOptions): Promise<void> {
    return;
  }

  async setTorrentsPriority({}: SetTorrentsPriorityOptions): Promise<void> {
    return;
  }

  async setTorrentsSequential({}: SetTorrentsSequentialOptions): Promise<void> {
    return;
  }

  async setTorrentsTags({}: SetTorrentsTagsOptions): Promise<void> {
    return;
  }

  async setTorrentsTrackers({}: SetTorrentsTrackersOptions): Promise<void> {
    return;
  }

  async setTorrentContentsPriority(hash: string, {}: SetTorrentContentsPropertiesOptions): Promise<void> {
    return;
  }

  async startTorrents({hashes}: StartTorrentsOptions): Promise<void> {
    return;
  }

  async stopTorrents({hashes}: StopTorrentsOptions): Promise<void> {
    return;
  }

  async fetchTorrentList(): Promise<TorrentListSummary> {
    const res = await this.clientRequestManager.methodCall('torrent.list', {});

    this.emit('PROCESS_TORRENT_LIST_START');

    const result = {
      id: Date.now(),
      torrents: Object.fromEntries(
        res.torrents.map(
          (t: {
            comment: string;
            name: string;
            hash: string;
            add_at: number;
            completed: number;
            directory_base: string;
            download_rate: number;
            download_total: number;
            private: boolean;
            upload_rate: number;
            total_length: number;
            upload_total: number;
            tags: string[];
            state: string;
            message: string;
            connection_count: number;
          }) => {
            const eta = t.download_rate ? (t.total_length - t.completed) / t.download_rate : 0;
            let state = t.state.toLowerCase();
            if (state === 'moving') {
              state = 'checking';
            }

            let tt: TorrentProperties = {
              hash: t.hash,
              comment: t.comment,
              trackerURIs: [],
              bytesDone: t.completed,
              tags: t.tags,
              dateActive: 0,
              dateAdded: t.add_at,
              dateCreated: 0,
              dateFinished: 0,
              directory: t.directory_base,
              downRate: t.download_rate,
              downTotal: t.download_total,
              eta: eta,
              isInitialSeeding: false, // not supported yet
              message: t.message,
              isSequential: false, // not supported yet
              name: t.name,
              isPrivate: t.private,
              peersConnected: t.connection_count,
              priority: 0,
              peersTotal: 0,
              percentComplete: (t.completed / t.total_length) * 100,
              ratio: t.upload_total / (t.download_total || t.total_length),
              status: [state as TorrentStatus],
              upRate: t.upload_rate,
              seedsConnected: 0,
              upTotal: t.upload_total,
              seedsTotal: 0,
              sizeBytes: t.total_length,
            };

            this.emit('PROCESS_TORRENT', tt);

            return [t.hash, tt];
          },
        ),
      ),
    };

    this.emit('PROCESS_TORRENT_LIST_END', result);
    return result;
  }

  async fetchTransferSummary(): Promise<TransferSummary> {
    const res = await this.clientRequestManager
      .methodCall('transfer_summary', {})
      .then(this.processClientRequestSuccess, this.processRPCRequestError);

    return {
      downRate: res.download_rate,
      downTotal: res.download_total,
      upRate: res.upload_rate,
      upTotal: res.upload_total,
    };
  }

  async getClientSessionDirectory(): Promise<{path: string; case: 'lower' | 'upper'}> {
    return {path: 'response', case: 'lower'};
  }

  async getClientSettings(): Promise<ClientSettings> {
    return {
      dht: false,
      dhtPort: 1024,
      directoryDefault: '',
      networkHttpMaxOpen: 0,
      networkLocalAddress: [],
      networkMaxOpenFiles: 0,
      networkPortOpen: false,
      networkPortRandom: false,
      networkPortRange: '',
      piecesHashOnCompletion: false,
      piecesMemoryMax: 0,
      protocolPex: false,
      throttleGlobalDownSpeed: 0,
      throttleGlobalUpSpeed: 0,
      throttleMaxPeersNormal: 0,
      throttleMaxPeersSeed: 0,
      throttleMaxDownloads: 0,
      throttleMaxDownloadsGlobal: 0,
      throttleMaxUploads: 0,
      throttleMaxUploadsGlobal: 0,
      throttleMinPeersNormal: 0,
      throttleMinPeersSeed: 0,
      trackersNumWant: 0,
    };
  }

  async setClientSettings(settings: SetClientSettingsOptions): Promise<void> {
    return;
  }

  async testGateway(): Promise<void> {
    return this.clientRequestManager
      .methodCall('system.ping', {})
      .then(() => this.processClientRequestSuccess(undefined), this.processClientRequestError);
  }

  processRPCRequestError = (error: RPCError) => {
    if (!error?.isRPCError) {
      return this.processClientRequestError(error);
    }

    throw error;
  };
}

export default TYRClientGatewayService;
