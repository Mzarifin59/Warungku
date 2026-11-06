<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Product extends Model
{
    use HasUuids;

    protected $fillable = [
        'store_id',
        'category_id',
        'name',
        'description',
        'price_idr',
        'image_path',
        'is_available',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'price_idr' => 'integer',
            'is_available' => 'boolean',
        ];
    }

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}