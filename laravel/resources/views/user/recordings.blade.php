@extends('layouts.okapp')

@section('content')
    <div class="card">
        <div class="card-header">録音履歴</div>
        <div class="card-body">
            @if($recordings->count() > 0)
                <div class="table-responsive">
                    <table class="table table-striped">
                        <thead>
                        <tr>
                            <th>曲名</th>
                            <th>アーティスト</th>
                            <th>録音日時</th>
                            <th>スコア</th>
                            <th>録音</th>
                            <th>操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        @foreach($recordings as $recording)
                            <tr>
                                <td>{{ $recording->song->title }}</td>
                                <td>{{ $recording->song->artist }}</td>
                                <td>{{ $recording->created_at->format('Y/m/d H:i') }}</td>
                                <td>
                                    @php
                                        $score = $userScores->where('song_id', $recording->song_id)
                                                           ->where('created_at', '>=', $recording->created_at)
                                                           ->where('created_at', '<=', $recording->created_at->addMinutes(5))
                                                           ->first();
                                    @endphp
                                    {{ $score ? $score->score : '-' }}
                                </td>
                                <td>
                                    <audio controls style="max-width: 250px;">
                                        <source src="{{ asset('storage/' . $recording->file_path) }}" type="audio/{{ pathinfo($recording->file_path, PATHINFO_EXTENSION) }}">
                                        お使いのブラウザはオーディオをサポートしていません。
                                    </audio>
                                </td>
                                <td>
                                    <div class="btn-group">
                                        <a href="{{ route('songs.play', $recording->song) }}" class="btn btn-sm btn-primary">再度挑戦</a>
                                        <form action="{{ route('recordings.destroy', $recording) }}" method="POST" onsubmit="return confirm('本当に削除しますか？');">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit" class="btn btn-sm btn-danger">削除</button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @endforeach
                        </tbody>
                    </table>
                </div>

                {{ $recordings->links() }}
            @else
                <p>録音がありません。</p>
            @endif
        </div>
    </div>
@endsection

