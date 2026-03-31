/**
 * Copyright 2026 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
// Note for Agent: Ensure src/data/mockData.ts is created before generating this component.
// import { cardData } from '../data/mockData';

/**
 * Gold Standard: ActivityCard (React Native)
 * This file serves as the definitive reference for the agent.
 */
interface ActivityCardProps {
  readonly id: string;
  readonly username: string;
  readonly action: 'MERGED' | 'COMMIT';
  readonly timestamp: string;
  readonly avatarUrl: string;
  readonly repoName: string;
}

export const ActivityCard: React.FC<ActivityCardProps> = React.memo(({
  username,
  action,
  timestamp,
  avatarUrl,
  repoName,
}) => {
  const isMerged = action === 'MERGED';

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <Image
          source={{ uri: avatarUrl }}
          style={styles.avatar}
          accessibilityLabel={`Avatar for ${username}`}
        />

        <View style={styles.infoSection}>
          <Pressable accessibilityRole="link">
            <Text style={styles.username}>{username}</Text>
          </Pressable>

          <View style={[
            styles.badge,
            isMerged ? styles.badgeMerged : styles.badgeCommit,
          ]}>
            <Text style={[
              styles.badgeText,
              isMerged ? styles.badgeTextMerged : styles.badgeTextCommit,
            ]}>
              {action}
            </Text>
          </View>

          <Text style={styles.inText}>in</Text>

          <Pressable accessibilityRole="link">
            <Text style={styles.repoName}>{repoName}</Text>
          </Pressable>
        </View>
      </View>

      <View>
        <Text style={styles.timestamp}>{timestamp}</Text>
      </View>
    </View>
  );
});

ActivityCard.displayName = 'ActivityCard';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    borderRadius: 8,
    backgroundColor: '#1A1A1A',
    padding: 16,
    minHeight: 56,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
    overflow: 'hidden',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  infoSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    columnGap: 8,
    rowGap: 4,
  },
  username: {
    fontWeight: '600',
    color: '#19e66f',
    fontSize: 14,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
  },
  badgeMerged: {
    backgroundColor: 'rgba(138, 43, 226, 0.3)',
  },
  badgeCommit: {
    backgroundColor: 'rgba(25, 230, 111, 0.3)',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  badgeTextMerged: {
    color: '#D0A9F5',
  },
  badgeTextCommit: {
    color: '#19e66f',
  },
  inText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
  },
  repoName: {
    color: '#19e66f',
    fontSize: 14,
  },
  timestamp: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.5)',
  },
});

export default ActivityCard;
