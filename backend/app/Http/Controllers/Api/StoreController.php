<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class StoreController extends Controller
{
    public function index(Request $request)
    {
        $stores = Store::where('owner_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json([
            'data' => $stores,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'slug' => 'required|unique:stores,slug|alpha_dash',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'whatsapp_number' => 'required|string|max:30',
            'is_published' => 'boolean',
            'logo' => 'nullable|image|max:2048',
        ]);

        $data['owner_id'] = $request->user()->id;

        if ($request->hasFile('logo')) {
            $data['logo_path'] = $request->file('logo')
                ->store('stores', 'public');
        }

        unset($data['logo']);

        $store = Store::create($data);

        return response()->json([
            'message' => 'Toko berhasil dibuat',
            'data' => $store,
        ], 201);
    }

    public function show(Request $request, string $id)
    {
        $store = $this->findOwnedStore($request, $id);

        return response()->json([
            'data' => $store->load(['categories', 'products']),
        ]);
    }

    public function update(Request $request, string $id)
    {
        $store = $this->findOwnedStore($request, $id);

        $data = $request->validate([
            'slug' => [
                'sometimes',
                'required',
                Rule::unique('stores', 'slug')->ignore($store->id),
            ],
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'whatsapp_number' => 'sometimes|required|string|max:30',
            'is_published' => 'sometimes|boolean',
            'logo' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('logo')) {
            if ($store->logo_path) {
                Storage::disk('public')->delete($store->logo_path);
            }

            $data['logo_path'] = $request->file('logo')
                ->store('stores', 'public');
        }

        unset($data['logo']);

        $store->update($data);

        return response()->json([
            'message' => 'Toko berhasil diperbarui',
            'data' => $store,
        ]);
    }

    public function destroy(Request $request, string $id)
    {
        $store = $this->findOwnedStore($request, $id);

        if ($store->logo_path) {
            Storage::disk('public')->delete($store->logo_path);
        }

        $store->delete();

        return response()->json([
            'message' => 'Toko berhasil dihapus',
        ]);
    }

    private function findOwnedStore(Request $request, string $id)
    {
        return Store::where('owner_id', $request->user()->id)
            ->findOrFail($id);
    }
}