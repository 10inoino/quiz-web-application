/**
 * クイズアプリの設定定数
 *
 * ここの値を変更することで、アプリ全体の挙動を一括で調整できます。
 */
export const QUIZ_CONFIG = {
  /**
   * 1問あたりの回答時間（秒）
   * タイマーバーがこの時間でカウントダウンされます。
   */
  ANSWER_DURATION_SECONDS: 30,

  /**
   * グリッドの列数
   */
  GRID_COLS: 7,

  /**
   * グリッドの行数
   */
  GRID_ROWS: 7,

  /**
   * 倍速タイマー音に切り替える経過秒数のしきい値
   * この秒数を経過すると、タイマー音が通常速度から倍速に切り替わります。
   * ANSWER_DURATION_SECONDS より小さい値を設定してください。
   */
  FAST_TIMER_THRESHOLD_SECONDS: 25,

  /**
   * タイマー開始前のディレイ（秒）
   * 問題が表示されてからタイマーが動き始めるまでの猶予時間です。
   */
  TIMER_DELAY_SECONDS: 5,
} as const
